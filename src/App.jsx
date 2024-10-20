import { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';
import { supabase } from './lib/supabase';
import { LandingPage } from './components/LandingPage';
import { QuestionForm } from './components/QuestionForm';
import { QuestionList } from './components/QuestionList';

export default function ErrorsManPlatform() {
  const [showLanding, setShowLanding] = useState(true);
  const [username, setUsername] = useState('');
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '' });
  const [newAnswer, setNewAnswer] = useState({ questionId: null, content: '' });
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!showLanding) {
      fetchQuestions();
      
      const questionsSubscription = supabase
        .channel('public:questions')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'questions' }, 
            handleQuestionChange)
        .subscribe();

      const answersSubscription = supabase
        .channel('public:answers')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'answers' }, 
            handleAnswerChange)
        .subscribe();

      return () => {
        supabase.removeChannel(questionsSubscription);
        supabase.removeChannel(answersSubscription);
      };
    }
  }, [showLanding]);

  const handleQuestionChange = (payload) => {
    if (payload.eventType === 'INSERT') {
      setQuestions(prev => [payload.new, ...prev]);
    }
  };

  const handleAnswerChange = async (payload) => {
    if (payload.eventType === 'INSERT') {
      await fetchQuestions();
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async () => {
    if (newQuestion.title.trim() && newQuestion.content.trim()) {
      try {
        const { error } = await supabase
          .from('questions')
          .insert([{
            title: newQuestion.title,
            content: newQuestion.content,
            user_id: username
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
        const { error } = await supabase
          .from('answers')
          .insert([{
            question_id: questionId,
            content: newAnswer.content,
            user_id: username
          }]);

        if (error) throw error;
        setNewAnswer({ questionId: null, content: '' });
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (showLanding) {
    return <LandingPage onUserSubmit={(name) => {
      setUsername(name);
      setShowLanding(false);
    }} />;
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="bg-blue-600 text-white p-4 rounded-lg mb-4">
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