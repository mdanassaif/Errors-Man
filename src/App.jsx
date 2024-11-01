// ErrorsManPlatform.js
import { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';
import { supabase } from './lib/supabase';
import { LandingPage } from './components/LandingPage';
import { QuestionForm } from './components/QuestionForm';
import { QuestionList } from './components/QuestionList';
import { generateAvatar } from './utils/avatar';

export default function ErrorsManPlatform() {
  const [showLanding, setShowLanding] = useState(true);
  const [username, setUsername] = useState('');
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '' });
  const [newAnswer, setNewAnswer] = useState({ questionId: null, content: '' });
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [error, setError] = useState(null);

  // Check local storage on initial render to persist login state
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      setShowLanding(false);
    }
  }, []);

  // Periodic refresh every 10 seconds
  useEffect(() => {
    if (!showLanding) {
      // Initial fetch
      fetchQuestions();

      // Set up interval for periodic refresh
      const intervalId = setInterval(() => {
        fetchQuestions();
      }, 10000);

      // Cleanup interval
      return () => clearInterval(intervalId);
    }
  }, [showLanding]);

  // Real-time updates using Supabase subscriptions
  useEffect(() => {
    if (!showLanding) {
      // Subscription for questions
      const questionsSubscription = supabase
        .channel('public:questions')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'questions' }, 
            handleQuestionChange)
        .subscribe();

      // Subscription for answers
      const answersSubscription = supabase
        .channel('public:answers')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'answers' }, 
            handleAnswerChange)
        .subscribe();

      // Cleanup subscriptions
      return () => {
        supabase.removeChannel(questionsSubscription);
        supabase.removeChannel(answersSubscription);
      };
    }
  }, [showLanding]);

  const handleQuestionChange = (payload) => {
    if (payload.eventType === 'INSERT') {
      // Add new question to the top of the list
      setQuestions(prev => [payload.new, ...prev]);
    }
  };

  const handleAnswerChange = async (payload) => {
    if (payload.eventType === 'INSERT') {
      // Update the specific question with its new answer
      updateQuestionWithNewAnswer(payload.new);
    }
  };

  const updateQuestionWithNewAnswer = async (newAnswer) => {
    // Find the question that the new answer belongs to
    setQuestions(prevQuestions => 
      prevQuestions.map(question => 
        question.id === newAnswer.question_id 
          ? {
              ...question, 
              answers: question.answers 
                ? [...question.answers, newAnswer] 
                : [newAnswer]
            }
          : question
      )
    );
  };

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          answers (*)
        `)
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

    // Store username in local storage to persist login state
    localStorage.setItem('username', name);

    try {
      const { error } = await supabase
        .from('users')
        .upsert({ username: name, avatar_url: avatarUrl }, { onConflict: 'username' });

      if (error) throw error;
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddQuestion = async () => {
    if (newQuestion.title.trim() && newQuestion.content.trim()) {
      try {
        const avatarUrl = generateAvatar(username);
        const { error } = await supabase
          .from('questions')
          .insert([{
            title: newQuestion.title,
            content: newQuestion.content,
            user_id: username,
            avatar_url: avatarUrl
          }]);

        if (error) throw error;
        setNewQuestion({ title: '', content: '' });
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleAddAnswer = async (questionId) => {
    if (newAnswer.content.trim()) {
      try {
        const avatarUrl = generateAvatar(username);
        const { error } = await supabase
          .from('answers')
          .insert([{
            question_id: questionId,
            content: newAnswer.content,
            user_id: username,
            avatar_url: avatarUrl
          }]);

        if (error) throw error;
        setNewAnswer({ questionId: null, content: '' });
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (showLanding) {
    return <LandingPage onUserSubmit={handleUserSubmit} />;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="bg-white shadow-md text-black p-4 rounded-lg mb-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Errors Man</h1>
          <div className="flex items-center gap-2">
            <Terminal className="h-6 w-6" />
            <span>Welcome, {username}!</span>
          </div>
        </div>
      </header>

      <QuestionForm 
        newQuestion={newQuestion}
        setNewQuestion={setNewQuestion}
        onSubmit={handleAddQuestion}
      />

      <QuestionList 
        questions={questions}
        selectedQuestion={selectedQuestion}
        setSelectedQuestion={setSelectedQuestion}
        newAnswer={newAnswer}
        setNewAnswer={setNewAnswer}
        onAnswerSubmit={handleAddAnswer}
      />
    </div>
  );
}