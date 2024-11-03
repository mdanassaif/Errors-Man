// ErrorsManPlatform.js
import { useState, useEffect } from 'react';
import { Terminal, Plus, X } from 'lucide-react';
import { supabase } from './lib/supabase';
import { LandingPage } from './components/LandingPage';
import { QuestionForm } from './components/QuestionForm';
import { QuestionList } from './components/QuestionList';
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
      {/* Header */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">ErrorsMan</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowQuestionForm(!showQuestionForm)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-700 text-white rounded-lg hover:bg-yellow-900"
            >
              {showQuestionForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {showQuestionForm ? 'Close' : 'Ask'}
            </button>
            <div className="flex items-center gap-2 text-gray-600">
              <Terminal className="w-5 h-5" />
              <span>{username}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg flex justify-between items-center">
            {error}
            <button onClick={() => setError(null)}>
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Question Form */}
        {showQuestionForm && (
          <QuestionForm
            newQuestion={newQuestion}
            setNewQuestion={setNewQuestion}
            onSubmit={handleAddQuestion}
          />
        )}

        {/* Questions List */}
        <QuestionList
          questions={questions}
          selectedQuestion={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
          newAnswer={newAnswer}
          setNewAnswer={setNewAnswer}
          onAnswerSubmit={handleAddAnswer}
        />
      </main>
    </div>
  );
}