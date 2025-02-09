import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { TimeAgo } from './TimeAgo';
import { ArrowLeft, Flame, Zap } from 'lucide-react';

export default function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [trendingQuestions, setTrendingQuestions] = useState([]);

  useEffect(() => {
    fetchQuestion();
    fetchTrendingQuestions();
  }, [id]);

  const fetchQuestion = async () => {
    try {
      const { data: questionData, error: questionError } = await supabase
        .from('questions')
        .select('*')
        .eq('id', id)
        .single();

      if (questionError) throw questionError;

      const { data: answersData, error: answersError } = await supabase
        .from('answers')
        .select('*')
        .eq('question_id', id)
        .order('created_at', { ascending: false });

      if (answersError) throw answersError;

      setQuestion(questionData);
      setAnswers(answersData);
    } catch {
      toast.error('Failed to fetch question details');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrendingQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) throw error;
      setTrendingQuestions(data);
    } catch {
      toast.error('Failed to fetch trending questions');
    }
  };

  const handleAddAnswer = async () => {
    if (!newAnswer.trim()) {
      toast.error('Please provide content for your answer');
      return;
    }

    try {
      const { error } = await supabase
        .from('answers')
        .insert([{
          question_id: id,
          content: newAnswer.trim(),
          user_id: 'currentUser', // Replace with actual user ID
        }]);

      if (error) throw error;

      setNewAnswer('');
      toast.success('Answer posted successfully!');
      await fetchQuestion();
    } catch {
      toast.error('Failed to post answer');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!question) {
    return <div className="text-center py-8">Question not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 flex gap-8">
      {/* Main Content (Question and Answers) */}
      <div className="flex-1">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Questions</span>
        </button>

        {/* Question Section */}
        <div className="bg-yellow-50 dark:bg-gray-800 rounded-xl  p-6 mb-8 border-2 border-yellow-300">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={question.avatar_url}
              alt={`${question.user_id}'s avatar`}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {question.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Asked by {question.user_id}</span>
                <span>•</span>
                <TimeAgo date={question.created_at} />
              </div>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-6">
            {question.content}
          </p>
          {question.code && (
            <div className="mb-6">
              <SyntaxHighlighter language={question.language} style={tomorrow}>
                {question.code}
              </SyntaxHighlighter>
            </div>
          )}
          {question.links && question.links.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Related Links
              </h3>
              <ul className="space-y-1">
                {question.links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 break-all"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Answers Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl  p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Answers
          </h2>
          {answers.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No answers yet. Be the first to answer!</p>
          ) : (
            answers.map((answer) => (
              <div key={answer.id} className="mb-6 pb-6 border-b last:border-b-0">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={answer.avatar_url}
                    alt={`${answer.user_id}'s avatar`}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {answer.user_id}
                    </h3>
                    <TimeAgo date={answer.created_at} className="text-xs text-gray-500 dark:text-gray-400" />
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {answer.content}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Answer Form */}
        <div className="mt-8">
          <textarea
            placeholder="Write your answer..."
            className="w-full p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
            rows="4"
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
          />
          <button
            onClick={handleAddAnswer}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
          >
            Post Answer
          </button>
        </div>
      </div>

      {/* Right Sidebar (Trending Questions + Sponsored) */}
      <div className="w-80 hidden lg:block">
        {/* Trending Questions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl  p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            Latest Questions
          </h3>
          <div className="space-y-4">
            {trendingQuestions.map((question) => (
              <Link
                to={`/question/${question.id}`}
                key={question.id}
                className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {question.title}
                </h4>
                <TimeAgo date={question.created_at} className="text-xs text-gray-500 dark:text-gray-400" />
              </Link>
            ))}
          </div>
        </div>

        {/* Sponsored Section */}
        {/* <div className="bg-white dark:bg-gray-800 rounded-xl  p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Sponsored
          </h3>
          <a
            href="https://freesvgicons.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <img
              src="https://c1.tablecdn.com/iconbuddy/svgicons-favicon.png"
              alt="Free SVG Icons"
              className="w-auto h-auto mb-2"
            />
            <p className="text-sm text-gray-700 dark:text-gray-300">
            Search Engine of 200k+ Open Source Free SVG Icons
            </p>
          </a>
        </div> */}
      </div>
    </div>
  );
}