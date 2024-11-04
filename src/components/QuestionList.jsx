// QuestionList.jsx
import { MessageCircle, Tag, CheckCircle } from 'lucide-react';
import PropTypes from 'prop-types';
import { TimeAgo } from './TimeAgo';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function QuestionList({ 
  questions, 
  selectedQuestion, 
  setSelectedQuestion, 
  newAnswer, 
  setNewAnswer, 
  onAnswerSubmit,
  currentUser 
}) {
  QuestionList.propTypes = {
    questions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      avatar_url: PropTypes.string.isRequired,
      user_id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      code: PropTypes.string,
      language: PropTypes.string,
      links: PropTypes.arrayOf(PropTypes.string),
      tags: PropTypes.arrayOf(PropTypes.string),
      answers: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        avatar_url: PropTypes.string.isRequired,
        user_id: PropTypes.string.isRequired,
        created_at: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        is_accepted: PropTypes.bool.isRequired,
      }))
    })).isRequired,
    selectedQuestion: PropTypes.number,
    setSelectedQuestion: PropTypes.func.isRequired,
    newAnswer: PropTypes.shape({
      questionId: PropTypes.number,
      content: PropTypes.string
    }).isRequired,
    setNewAnswer: PropTypes.func.isRequired,
    onAnswerSubmit: PropTypes.func.isRequired,
    currentUser: PropTypes.string.isRequired
  };

  const renderCode = (code, language) => {
    if (!code) return null;

    return (
      <div className="mt-4 bg-gray-900 rounded-lg overflow-hidden">
        <div className="px-4 py-2 bg-gray-800 text-gray-300 text-sm">
          {language || 'Code'}
        </div>
        <SyntaxHighlighter
          language={language || 'javascript'}
          style={tomorrow}
          customStyle={{
            margin: 0,
            padding: '1rem',
            backgroundColor: 'transparent'
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  };

  const handleAcceptAnswer = async (questionId, answerId) => {
    try {
      const { error } = await supabase
        .from('answers')
        .update({ is_accepted: true })
        .eq('id', answerId)
        .eq('question_id', questionId);

      if (error) throw error;
      
      // Update local state to reflect the change
      // const updatedQuestions = questions.map(question => {
      //   if (question.id === questionId) {
      //     return {
      //       ...question,
      //       answers: question.answers.map(answer => ({
      //         ...answer,
      //         is_accepted: answer.id === answerId
      //       }))
      //     };
      //   }
      //   return question;
      // });
      
      // // You'll need to implement this state update in your parent component
      // onQuestionsUpdate(updatedQuestions);
    } catch (error) {
      console.error('Error accepting answer:', error);
    }
  };

  return (
    <div className="space-y-6">
      {questions.map((question) => (
        <div key={question.id} className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            {/* Question Header */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={question.avatar_url}
                alt={`${question.user_id}'s avatar`}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {question.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{question.user_id}</span>
                  <span>|</span>
                  <TimeAgo date={question.created_at} />
                </div>
              </div>
            </div>

            {/* Tags */}
            {question.tags && question.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {question.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-1"
                  >
                    <Tag className="w-4 h-4" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Question Content */}
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">
                {question.content}
              </p>

              {/* Code Block */}
              {question.code && renderCode(question.code, question.language)}

              {/* Links */}
              {question.links && question.links.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium text-gray-900">Related Links:</h4>
                  <ul className="space-y-1">
                    {question.links.map((link, index) => (
                      <li key={index}>
                        
                     <a     href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-500 hover:text-red-600 break-all"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Question Actions */}
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => setSelectedQuestion(
                  selectedQuestion === question.id ? null : question.id
                )}
                className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
              >
                <MessageCircle className="w-5 h-5" />
                {question.answers?.length || 0} Answers
              </button>
            </div>
          </div>

          {/* Answers Section */}
          {selectedQuestion === question.id && (
            <div className="border-t bg-gray-50">
              {/* Answer Form */}
              <div className="p-6 border-b">
                <textarea
                  placeholder="Write your answer..."
                  className="w-full p-4 rounded-lg bg-white border focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  rows="4"
                  value={newAnswer.questionId === question.id ? newAnswer.content : ''}
                  onChange={(e) => setNewAnswer({
                    questionId: question.id,
                    content: e.target.value
                  })}
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => onAnswerSubmit(question.id)}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Post Answer
                  </button>
                </div>
              </div>

              {/* Answers List */}
              {question.answers?.map((answer) => (
                <div key={answer.id} className="p-6 border-b last:border-b-0">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={answer.avatar_url}
                      alt={`${answer.user_id}'s avatar`}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {answer.user_id}
                      </div>
                      <TimeAgo date={answer.created_at} />
                    </div>
                    {answer.is_accepted && (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Accepted Answer</span>
                      </div>
                    )}
                    {question.user_id === currentUser && !answer.is_accepted && (
                      <button
                        onClick={() => handleAcceptAnswer(question.id, answer.id)}
                        className="text-gray-500 hover:text-green-600"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {answer.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}