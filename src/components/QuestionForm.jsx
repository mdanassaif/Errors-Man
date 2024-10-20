import { Send } from 'lucide-react';
import PropTypes from 'prop-types';

QuestionForm.propTypes = {
  newQuestion: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
  }).isRequired,
  setNewQuestion: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export function QuestionForm({ newQuestion, setNewQuestion, onSubmit }) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">Ask a Question</h2>
      <input
        type="text"
        placeholder="Question Title"
        className="w-full p-3 mb-4 border rounded-lg bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:border-blue-500 focus:ring-blue-500 transition-colors"
        value={newQuestion.title}
        onChange={(e) => setNewQuestion(prev => ({ ...prev, title: e.target.value }))}
      />
      <textarea
        placeholder="Question Details"
        className="w-full p-3 mb-4 border rounded-lg bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:border-blue-500 focus:ring-blue-500 transition-colors"
        rows="4"
        value={newQuestion.content}
        onChange={(e) => setNewQuestion(prev => ({ ...prev, content: e.target.value }))}
      />
      <button
        onClick={onSubmit}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
      >
        <Send className="h-5 w-5" />
        Post Question
      </button>
    </div>
  );
}