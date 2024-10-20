import { useState, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client - replace with your project URL and anon key
const supabase = createClient(
  'https://wethrtnxdiloeolzxzyd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndldGhydG54ZGlsb2VvbHp4enlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIyMjM2NTUsImV4cCI6MjAzNzc5OTY1NX0.22Ie6AnvJG9ZFNR5EQb0y-SWjr5mY1B2qKu7h03Wpz4'
);

export default function QAPlatform() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '' });
  const [newAnswer, setNewAnswer] = useState({ questionId: null, content: '' });
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch questions on component mount
  useEffect(() => {
    fetchQuestions();
    
    // Set up real-time subscription
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
  }, []);

  const handleQuestionChange = (payload) => {
    if (payload.eventType === 'INSERT') {
      setQuestions(prev => [payload.new, ...prev]);
    }
  };

  const handleAnswerChange = async (payload) => {
    if (payload.eventType === 'INSERT') {
      // Refresh questions to get updated answers
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
            user_id: 'anonymous' // Replace with actual user ID when auth is implemented
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
            user_id: 'anonymous' // Replace with actual user ID when auth is implemented
          }]);

        if (error) throw error;
        setNewAnswer({ questionId: null, content: '' });
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="bg-blue-600 text-white p-4 rounded-lg mb-4">
        <h1 className="text-2xl font-bold">Q&A Platform</h1>
      </header>

      <div className="bg-white rounded-lg p-4 mb-4">
        <h2 className="text-xl font-bold mb-2">Ask a Question</h2>
        <input
          type="text"
          placeholder="Question Title"
          className="w-full p-2 mb-2 border rounded"
          value={newQuestion.title}
          onChange={(e) => setNewQuestion(prev => ({ ...prev, title: e.target.value }))}
        />
        <textarea
          placeholder="Question Details"
          className="w-full p-2 mb-2 border rounded"
          value={newQuestion.content}
          onChange={(e) => setNewQuestion(prev => ({ ...prev, content: e.target.value }))}
        />
        <button
          onClick={handleAddQuestion}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          Post Question
        </button>
      </div>

      <div className="space-y-4">
        {questions.map((question) => (
          <div key={question.id} className="bg-white rounded-lg p-4">
            <h3 
              className="text-xl font-bold text-blue-600 cursor-pointer"
              onClick={() => setSelectedQuestion(selectedQuestion === question.id ? null : question.id)}
            >
              {question.title}
            </h3>
            <p className="text-gray-600 mt-2">{question.content}</p>
            <div className="text-sm text-gray-500 mt-2">
              <span>Anonymous • {new Date(question.created_at).toLocaleString()}</span>
              <span className="ml-2 flex items-center">
                <MessageCircle className="h-4 w-4 mr-1" />
                {question.answers?.length || 0} answers
              </span>
            </div>

            {selectedQuestion === question.id && (
              <div className="mt-4 pl-4 border-l-2">
                <div className="mb-4">
                  <textarea
                    placeholder="Write your answer..."
                    className="w-full p-2 border rounded"
                    value={newAnswer.questionId === question.id ? newAnswer.content : ''}
                    onChange={(e) => setNewAnswer({ questionId: question.id, content: e.target.value })}
                  />
                  <button
                    onClick={() => handleAddAnswer(question.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
                  >
                    Post Answer
                  </button>
                </div>

                {question.answers?.map((answer) => (
                  <div key={answer.id} className="bg-gray-50 p-4 rounded mb-2">
                    <p>{answer.content}</p>
                    <div className="text-sm text-gray-500 mt-2">
                      Anonymous • {new Date(answer.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}