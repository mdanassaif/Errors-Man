import { MessageCircle } from 'lucide-react';
import PropTypes from 'prop-types';

QuestionList.propTypes = {
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      user_id: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      avatar_url: PropTypes.string,
      answers: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          content: PropTypes.string.isRequired,
          user_id: PropTypes.string.isRequired,
          created_at: PropTypes.string.isRequired,
          avatar_url: PropTypes.string,
        })
      ),
    })
  ).isRequired,
  selectedQuestion: PropTypes.number,
  setSelectedQuestion: PropTypes.func.isRequired,
  newAnswer: PropTypes.shape({
    questionId: PropTypes.number,
    content: PropTypes.string,
  }).isRequired,
  setNewAnswer: PropTypes.func.isRequired,
  onAnswerSubmit: PropTypes.func.isRequired,
};

export function QuestionList({ 
  questions, 
  selectedQuestion, 
  setSelectedQuestion, 
  newAnswer, 
  setNewAnswer, 
  onAnswerSubmit 
}) {
  return (
    <div className="space-y-6">
      {questions.map((question) => (
        <div key={question.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <img src={question.avatar_url} alt="User Avatar" className="w-10 h-10 rounded-full mr-3" />
              <div>
                <h3 
                  className="text-xl font-bold text-gray-800 cursor-pointer hover:text-blue-600"
                  onClick={() => setSelectedQuestion(selectedQuestion === question.id ? null : question.id)}
                >
                  {question.title}
                </h3>
                <p className="text-sm text-gray-500">{question.user_id} • {new Date(question.created_at).toLocaleString()}</p>
              </div>
            </div>
            <p className="text-gray-700 mt-2">{question.content}</p>
            <div className="text-sm text-gray-500 mt-4 flex items-center justify-end">
              <span className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-1" />
                {question.answers?.length || 0} answers
              </span>
            </div>
          </div>

          {selectedQuestion === question.id && (
            <div className="bg-gray-100 p-6 border-t">
              <div className="mb-6">
                <textarea
                  placeholder="Write your answer..."
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  value={newAnswer.questionId === question.id ? newAnswer.content : ''}
                  onChange={(e) => setNewAnswer({ questionId: question.id, content: e.target.value })}
                />
                <button
                  onClick={() => onAnswerSubmit(question.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Post Answer
                </button>
              </div>

              {question.answers?.map((answer) => (
                <div key={answer.id} className="bg-white p-4 rounded-lg shadow-sm mb-4">
                  <div className="flex items-center mb-2">
                    <img src={answer.avatar_url} alt="User Avatar" className="w-8 h-8 rounded-full mr-2" />
                    <div className="text-sm text-gray-600">
                      {answer.user_id} • {new Date(answer.created_at).toLocaleString()}
                    </div>
                  

                  </div>
                  <p className="text-gray-800">{answer.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}