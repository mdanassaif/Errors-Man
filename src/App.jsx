import { useState, useEffect } from 'react';
import { Terminal, Plus, X, Clock } from 'lucide-react';
import { supabase } from './lib/supabase';
import { LandingPage } from './components/LandingPage';
import { QuestionForm } from './components/QuestionForm';
import { QuestionList } from './components/QuestionList';
import { UserModal } from './components/Usermodal';
import { Advertisement } from './components/Advertisement';
import { generateAvatar } from './utils/avatar';

export default function ErrorsManPlatform() {
  const [showLanding, setShowLanding] = useState(true);
  const [username, setUsername] = useState('');
  const [questions, setQuestions] = useState([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    content: '',
    code: '',
    language: '',
    links: []
  });
  const [newAnswer, setNewAnswer] = useState({ questionId: null, content: '' });
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [error, setError] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      setShowLanding(false);
    }
  }, []);

  useEffect(() => {
    if (!showLanding) {
      fetchQuestions();
      const intervalId = setInterval(fetchQuestions, 10000);
      return () => clearInterval(intervalId);
    }
  }, [showLanding]);

  useEffect(() => {
    if (!showLanding) {
      const questionsChannel = supabase
        .channel('public:questions')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'questions' }, handleQuestionChange)
        .subscribe();

      const answersChannel = supabase
        .channel('public:answers')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'answers' }, handleAnswerChange)
        .subscribe();

      return () => {
        supabase.removeChannel(questionsChannel);
        supabase.removeChannel(answersChannel);
      };
    }
  }, [showLanding]);

  const handleQuestionChange = (payload) => {
    if (payload.eventType === 'INSERT') {
      setQuestions(prev => [payload.new, ...prev]);
    }
  };

  const handleAnswerChange = (payload) => {
    if (payload.eventType === 'INSERT') {
      setQuestions(prevQuestions =>
        prevQuestions.map(question =>
          question.id === payload.new.question_id
            ? {
              ...question,
              answers: [...(question.answers || []), payload.new]
            }
            : question
        )
      );
    }
  };

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*, answers(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuestions(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUserSubmit = async (name) => {
    const avatarUrl = generateAvatar(name);
    setUsername(name);
    setShowLanding(false);
    localStorage.setItem('username', name);

    try {
      const { error } = await supabase
        .from('users')
        .upsert({ username: name, avatar_url: avatarUrl });

      if (error) throw error;
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.title.trim() || !newQuestion.content.trim()) {
      setError('Please provide both title and content for your question');
      return;
    }

    try {
      const avatarUrl = generateAvatar(username);
      const questionData = {
        title: newQuestion.title.trim(),
        content: newQuestion.content.trim(),
        user_id: username,
        avatar_url: avatarUrl,
        // Always include code fields even if empty
        code: newQuestion.code.trim(),
        language: newQuestion.language,
        links: newQuestion.links
      };

      const { error: dbError } = await supabase
        .from('questions')
        .insert([questionData]);

      if (dbError) throw dbError;

      setNewQuestion({ title: '', content: '', code: '', language: '', links: [] });
      setShowQuestionForm(false);
      await fetchQuestions();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddAnswer = async (questionId) => {
    if (!newAnswer.content.trim()) {
      setError('Please provide content for your answer');
      return;
    }

    try {
      const avatarUrl = generateAvatar(username);
      const { error: dbError } = await supabase
        .from('answers')
        .insert([{
          question_id: questionId,
          content: newAnswer.content.trim(),
          user_id: username,
          avatar_url: avatarUrl
        }]);

      if (dbError) throw dbError;

      setNewAnswer({ questionId: null, content: '' });
      await fetchQuestions(); // Refresh questions list
    } catch (err) {
      setError(err.message);
    }
  };
 

  if (showLanding) {
    return <LandingPage onUserSubmit={handleUserSubmit} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Responsive Header */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <h1 className="text-2xl font-bold text-gray-900">ErrorsMan</h1>
            {/* Menu button for mobile */}
            <button className="sm:hidden text-gray-600 hover:text-gray-900">
              <Terminal className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>
            <button
              onClick={() => setShowQuestionForm(!showQuestionForm)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-700 text-white rounded-lg hover:bg-yellow-900 w-full sm:w-auto justify-center"
            >
              {showQuestionForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {showQuestionForm ? 'Close' : 'Ask'}
            </button>
            <button
              onClick={() => setIsUserModalOpen(true)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <Terminal className="w-5 h-5" />
              <span>{username}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content with responsive layout */}
      <div className="flex h-[calc(100vh-5rem)]"> {/* Subtract header height */}
        {/* Left Sidebar - Hidden on mobile */}
        <div className="hidden md:block w-60 bg-white p-4 overflow-y-auto border-r">
          <div className="space-y-4">
            <p className="text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </div>

        {/* Middle Content - Full width on mobile */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg flex justify-between items-center">
              {error}
              <button onClick={() => setError(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {showQuestionForm && (
            <QuestionForm
              newQuestion={newQuestion}
              setNewQuestion={setNewQuestion}
              onSubmit={handleAddQuestion}
            />
          )}

          <QuestionList
            questions={questions}
            selectedQuestion={selectedQuestion}
            setSelectedQuestion={setSelectedQuestion}
            newAnswer={newAnswer}
            setNewAnswer={setNewAnswer}
            onAnswerSubmit={handleAddAnswer}
          />
        </div>

        {/* Right Sidebar - Hidden on mobile */}
        <div className="hidden lg:block w-80 bg-white p-4 overflow-y-auto border-l">
          <Advertisement />
        </div>
      </div>

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        username={username}
        avatarUrl={generateAvatar(username)}
      />
    </div>
)
}