import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { TimeAgo } from './TimeAgo';
import { supabase } from '../lib/supabase';

export function QuestionList({ questions, onVote }) {
  const [userVotes, setUserVotes] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserVotes = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('votes')
        .select('question_id')
        .eq('user_id', user.id);
      setUserVotes(data?.map(v => v.question_id) ?? []);
    };
    fetchUserVotes();
  }, [user]);

  const handleUpvote = async (questionId) => {
    if (!user) return;

    const hasVoted = userVotes.includes(questionId);
    
    try {
      if (hasVoted) {
        await supabase
          .from('votes')
          .delete()
          .match({ question_id: questionId, user_id: user.id });
        setUserVotes(prev => prev.filter(id => id !== questionId));
      } else {
        await supabase
          .from('votes')
          .insert({ question_id: questionId, user_id: user.id });
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
        onVote: PropTypes.func,
      };
      onVote?.();
    } catch (error) {
      console.error('Vote error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {questions.map((question) => (
        <Link
          to={`/question/${question.id}`}
          key={question.id}
          className="block bg-white dark:bg-gray-800 rounded-xl overflow-hidden transition-all duration-300  hover:-translate-y-1"
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
                  <span>|</span>
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
              >
                <span>▲</span>
                <span>{question.vote_count}</span>
              </button>
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10H4a2 2 0 0 1-2-2v-8C2 6.477 6.477 2 12 2" className="duoicon-secondary-layer" opacity=".3"/><path fill="currentColor" d="M15 10H9a1 1 0 0 0-.117 1.993L9 12h6a1 1 0 0 0 .117-1.993zm-3 4H9a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2" className="duoicon-primary-layer"/></svg> 
                <span>{question.answers?.length || 0}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}