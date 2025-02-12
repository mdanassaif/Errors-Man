import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { TimeAgo } from './TimeAgo';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';

export function QuestionList({ questions, setQuestions, currentUser }) {
  const [userVotes, setUserVotes] = useState([]);
  const [loadingVotes, setLoadingVotes] = useState(true);

  // Fetch user's votes on mount and user change
  useEffect(() => {
    const fetchUserVotes = async () => {
      if (!currentUser?.id) {
        setUserVotes([]);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('votes')
          .select('question_id')
          .eq('user_id', currentUser.id);

        if (error) throw error;
        setUserVotes(data.map(v => v.question_id));
      } catch (error) {
        toast.error('Failed to load votes');
        console.error('Vote fetch error:', error);
      } finally {
        setLoadingVotes(false);
      }
    };

    fetchUserVotes();
  }, [currentUser?.id]); // Add proper dependency

  // Real-time updates for votes
  useEffect(() => {
    if (!currentUser?.id) return;

    const channel = supabase
      .channel('votes-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'votes',
        filter: `user_id=eq.${currentUser.id}`
      }, async (payload) => {
        // Update votes immediately
        setUserVotes(prev => {
          if (payload.eventType === 'INSERT') {
            return [...prev, payload.new.question_id];
          }
          if (payload.eventType === 'DELETE') {
            return prev.filter(id => id !== payload.old.question_id);
          }
          return prev;
        });
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [currentUser?.id]);

  const handleUpvote = async (questionId) => {
    if (!currentUser?.id) {
      toast.error('Please login to vote');
      return;
    }

    try {
      const { data: existingVote, error: voteError } = await supabase
        .from('votes')
        .select()
        .match({ 
          question_id: questionId, 
          user_id: currentUser.id 
        });

      if (voteError) throw voteError;

      // Optimistic update
      setQuestions(prevQuestions => 
        prevQuestions.map(q => {
          if (q.id === questionId) {
            const newCount = existingVote.length > 0 
              ? q.vote_count - 1 
              : q.vote_count + 1;
            return { ...q, vote_count: newCount };
          }
          return q;
        })
      );

      if (existingVote.length > 0) {
        // Remove vote
        const { error } = await supabase
          .from('votes')
          .delete()
          .match({ 
            question_id: questionId, 
            user_id: currentUser.id 
          });
        if (error) throw error;
      } else {
        // Add vote
        const { error } = await supabase
          .from('votes')
          .insert({ 
            question_id: questionId, 
            user_id: currentUser.id 
          });
        if (error) throw error;
      }

    } catch (error) {
      toast.error(error.message || 'Failed to process vote');
      console.error('Voting error:', error);
      // Rollback optimistic update
      setQuestions(prevQuestions => prevQuestions.map(q => 
        q.id === questionId 
          ? { ...q, vote_count: q.vote_count } // Reset count
          : q
      ));
    }
  };
  return (
    <div className="space-y-6">
      {questions.map((question) => (
        <Link
          to={`/question/${question.id}`}
          key={question.id}
          className="block bg-white dark:bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
        >
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={question.avatar_url}
                alt={`${question.user_id}'s avatar`}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {question.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>{question.user_id}</span>
                  <span>•</span>
                  <TimeAgo date={question.created_at} />
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
              {question.content}
            </p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleUpvote(question.id);
                }}
                className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors ${
                  userVotes.includes(question.id)
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                disabled={loadingVotes}
              >
                <span>▲</span>
                <span>{question.vote_count}</span>
              </button>
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10H4a2 2 0 0 1-2-2v-8C2 6.477 6.477 2 12 2" className="duoicon-secondary-layer" opacity=".3"/>
                  <path fill="currentColor" d="M15 10H9a1 1 0 0 0-.117 1.993L9 12h6a1 1 0 0 0 .117-1.993zm-3 4H9a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2" className="duoicon-primary-layer"/>
                </svg>
                <span>{question.answers?.length || 0}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

QuestionList.propTypes = {
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      user_id: PropTypes.string.isRequired,
      avatar_url: PropTypes.string,
      created_at: PropTypes.string.isRequired,
      vote_count: PropTypes.number.isRequired,
      answers: PropTypes.arrayOf(PropTypes.object),
    })
  ).isRequired,
  setQuestions: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
};