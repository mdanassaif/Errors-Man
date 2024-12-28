import { useState, useEffect } from 'react';
import { Terminal, Plus, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
 
import { QuestionForm } from '../components/QuestionForm';
import { QuestionList } from '../components/QuestionList';
import PropTypes from 'prop-types';
import { UserModal } from '../components/Usermodal';
import { Advertisement } from '../components/Advertisement';
import { generateAvatar } from '../utils/avatar';
import Left from '../components/left';


export default function ErrorsManPlatform({ initialUsername })  {
  const [showLanding, setShowLanding] = useState(true);
  const [username, setUsername] = useState(initialUsername);
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
  // eslint-disable-next-line no-unused-vars
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Create style element
    const style = document.createElement('style');
    style.id = 'no-scrollbar';
    style.textContent = `
      html::-webkit-scrollbar {
        display: none;
      }
      
      html {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    
    // Add to document head
    document.head.appendChild(style);

    // Cleanup on unmount
    return () => {
      document.head.removeChild(style);
    };
  }, []);


  ErrorsManPlatform.propTypes = {
    initialUsername: PropTypes.string.isRequired
  };

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
      await fetchQuestions();
    } catch (err) {
      setError(err.message);
    }
  };

 
  return (
    <div className="max-h-screen bg-gray-100">
      {/* Enhanced Header */}
      <header className="text-white p-4 top-0 z-10 border-b-2 border-yellow-700">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Logo and Brand Section */}
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div className="flex items-center space-x-2">
              <Terminal className="w-7 h-7 text-yellow-700" />
              <div className="flex flex-col">
                <h1 className="text-4xl font-bold tracking-tight text-yellow-800">ErrorsMan</h1>
                <span className="text-xs text-yellow-900">Debug Together, Grow Together</span>
              </div>
            </div>
            <button className="sm:hidden text-yellow-200 hover:text-yellow-100">
              <Terminal className="w-5 h-5" />
            </button>
          </div>

          {/* Actions Section */}
          <div className="flex flex-row sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => setShowQuestionForm(!showQuestionForm)}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-full  transition-all duration-300 w-full sm:w-auto justify-center  transform hover:-translate-y-0.5"
            >
              {showQuestionForm ? (
                <>
                  <X className="w-5 h-5" />
                  <span className="text-sm font-medium">Close</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span className="text-sm font-medium">Ask Question</span>
                </>
              )}
            </button>

            {/* User Profile Button */}
            <button
              onClick={() => setIsUserModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-800/40 rounded-full hover:bg-yellow-800/60 transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-full bg-yellow-200 flex items-center justify-center">
                <span className="text-yellow-800 text-sm font-medium">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium">{username}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-5rem)]">
        {/* Left Sidebar */}
        <div className="hidden md:block w-80 bg-white p-4 overflow-y-auto border-r">
          <Left />
        </div>

        {/* Main Content */}
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
            currentUser={username}
          />
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block w-100 bg-white p-4 overflow-y-auto border-l">
          <Advertisement />
        </div>
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        username={username}
        avatarUrl={generateAvatar(username)}
      />
    </div>
  );
}