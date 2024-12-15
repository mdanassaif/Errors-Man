import { useState, useEffect } from 'react';
import { Send, Link as LinkIcon, Code } from 'lucide-react';
import PropTypes from 'prop-types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const RATE_LIMIT_DURATION = 300000; // 5 minutes in milliseconds
const MAX_QUESTIONS_PER_PERIOD = 3;
const MAX_LINKS_PER_QUESTION = 5;
const MIN_TITLE_LENGTH = 15;
const MAX_TITLE_LENGTH = 65;
const MIN_CONTENT_LENGTH = 30;
const MAX_CONTENT_LENGTH = 1500;
const MAX_CODE_LENGTH = 1500;

export function QuestionForm({ newQuestion, setNewQuestion, onSubmit }) {
  const [activeTab, setActiveTab] = useState('details');
  const [error, setError] = useState('');
  const [remainingQuestions, setRemainingQuestions] = useState(MAX_QUESTIONS_PER_PERIOD);
  const [nextResetTime, setNextResetTime] = useState(null);

  const programmingLanguages = [
    'javascript', 'python', 'java', 'cpp', 'html', 'css'
  ];

  useEffect(() => {
    // Load rate limit data from localStorage
    const storedData = localStorage.getItem('questionFormRateLimit');
    if (storedData) {
      const { count, resetTime } = JSON.parse(storedData);
      const now = Date.now();
      
      if (now < resetTime) {
        setRemainingQuestions(MAX_QUESTIONS_PER_PERIOD - count);
        setNextResetTime(resetTime);
      } else {
        // Reset if time period has expired
        resetRateLimit();
      }
    } else {
      resetRateLimit();
    }
  }, []);

  const resetRateLimit = () => {
    const resetTime = Date.now() + RATE_LIMIT_DURATION;
    localStorage.setItem('questionFormRateLimit', JSON.stringify({
      count: 0,
      resetTime
    }));
    setRemainingQuestions(MAX_QUESTIONS_PER_PERIOD);
    setNextResetTime(resetTime);
  };

  const validateQuestion = () => {
    if (!newQuestion.title || newQuestion.title.length < MIN_TITLE_LENGTH) {
      return `Title must be at least ${MIN_TITLE_LENGTH} characters long`;
    }
    if (newQuestion.title.length > MAX_TITLE_LENGTH) {
      return `Title must be less than ${MAX_TITLE_LENGTH} characters`;
    }
    if (!newQuestion.content || newQuestion.content.length < MIN_CONTENT_LENGTH) {
      return `Description must be at least ${MIN_CONTENT_LENGTH} characters long`;
    }
    if (newQuestion.content.length > MAX_CONTENT_LENGTH) {
      return `Description must be less than ${MAX_CONTENT_LENGTH} characters`;
    }
    if (newQuestion.code && newQuestion.code.length > MAX_CODE_LENGTH) {
      return `Code must be less than ${MAX_CODE_LENGTH} characters`;
    }
    if (newQuestion.links?.length > MAX_LINKS_PER_QUESTION) {
      return `Maximum ${MAX_LINKS_PER_QUESTION} links allowed per question`;
    }
    return '';
  };

  const handleSubmit = () => {
    const validationError = validateQuestion();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (remainingQuestions <= 0) {
      setError(`Rate limit reached. Please try again after ${new Date(nextResetTime).toLocaleTimeString()}`);
      return;
    }

    // Update rate limit in localStorage
    const storedData = JSON.parse(localStorage.getItem('questionFormRateLimit'));
    const newCount = (storedData.count || 0) + 1;
    localStorage.setItem('questionFormRateLimit', JSON.stringify({
      count: newCount,
      resetTime: storedData.resetTime
    }));
    setRemainingQuestions(prev => prev - 1);

    // Call the original onSubmit
    onSubmit();
    setError('');
  };

  const handleAddLink = (e) => {
    e.preventDefault();
    const link = e.target.link.value;
    
    try {
      new URL(link);
      if (newQuestion.links?.length >= MAX_LINKS_PER_QUESTION) {
        setError(`Maximum ${MAX_LINKS_PER_QUESTION} links allowed`);
        return;
      }
      setNewQuestion(prev => ({
        ...prev,
        links: [...(prev.links || []), link]
      }));
      e.target.reset();
      setError('');
    } catch {
      setError('Please enter a valid URL');
    }
  };

  const renderDetailsTab = () => (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="What's your programming question?"
          className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none"
          value={newQuestion.title}
          onChange={(e) => setNewQuestion(prev => ({ ...prev, title: e.target.value }))}
          maxLength={MAX_TITLE_LENGTH}
        />
        <div className="text-sm text-gray-500 mt-1">
          {newQuestion.title.length}/{MAX_TITLE_LENGTH} characters
        </div>
      </div>

      <div>
        <textarea
          placeholder="Describe your problem in detail..."
          className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none"
          rows="4"
          value={newQuestion.content}
          onChange={(e) => setNewQuestion(prev => ({ ...prev, content: e.target.value }))}
          maxLength={MAX_CONTENT_LENGTH}
        />
        <div className="text-sm text-gray-500 mt-1">
          {newQuestion.content.length}/{MAX_CONTENT_LENGTH} characters
        </div>
      </div>
    </div>
  );

  const renderCodeTab = () => (
    <div className="space-y-4">
      <select
        className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none"
        value={newQuestion.language}
        onChange={(e) => setNewQuestion(prev => ({ ...prev, language: e.target.value }))}
      >
        <option value="">Select Programming Language</option>
        {programmingLanguages.map(lang => (
          <option key={lang} value={lang}>{lang.toUpperCase()}</option>
        ))}
      </select>

      <div>
        <textarea
          placeholder="Paste your code here..."
          className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none font-mono"
          rows="8"
          value={newQuestion.code}
          onChange={(e) => setNewQuestion(prev => ({ ...prev, code: e.target.value }))}
          maxLength={MAX_CODE_LENGTH}
        />
        <div className="text-sm text-gray-500 mt-1">
          {newQuestion.code.length}/{MAX_CODE_LENGTH} characters
        </div>
      </div>

      {newQuestion.code && (
        <SyntaxHighlighter
          language={newQuestion.language || 'javascript'}
          style={tomorrow}
          className="rounded-lg"
        >
          {newQuestion.code}
        </SyntaxHighlighter>
      )}
    </div>
  );

  const renderLinksTab = () => (
    <div className="space-y-4">
      <form onSubmit={handleAddLink} className="flex gap-2">
        <input
          name="link"
          type="url"
          placeholder="https://example.com"
          className="flex-1 p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:bg-yellow-600 transition-colors"
        >
          Add
        </button>
      </form>

      {newQuestion.links?.length > 0 && (
        <div className="space-y-2">
          {newQuestion.links.map((link, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
              <a href={link} target="_blank" rel="noopener noreferrer" className="flex-1 truncate hover:text-blue-500">
                {link}
              </a>
              <button
                onClick={() => setNewQuestion(prev => ({
                  ...prev,
                  links: prev.links.filter((_, i) => i !== index)
                }))}
                className="text-red-500 hover:text-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="mb-4">
        <div className="text-sm text-gray-600">
          Questions remaining: {remainingQuestions}/{MAX_QUESTIONS_PER_PERIOD}
          {nextResetTime && (
            <span> (Resets at {new Date(nextResetTime).toLocaleTimeString()})</span>
          )}
        </div>
      </div>

      <div className="flex gap-4 mb-6 ">
        <TabButton
          active={activeTab === 'details'}
          onClick={() => setActiveTab('details')}
          icon={<Send className="w-4 h-4" />}
          label="Details"
        />
        <TabButton
          active={activeTab === 'code'}
          onClick={() => setActiveTab('code')}
          icon={<Code className="w-4 h-4" />}
          label="Code"
        />
        <TabButton
          active={activeTab === 'links'}
          onClick={() => setActiveTab('links')}
          icon={<LinkIcon className="w-4 h-4" />}
          label="Links"
        />
      </div>

      {activeTab === 'details' && renderDetailsTab()}
      {activeTab === 'code' && renderCodeTab()}
      {activeTab === 'links' && renderLinksTab()}

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={remainingQuestions <= 0}
          className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Post Question
        </button>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
        ${active
          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
    >
      {icon}
      {label}
    </button>
  );
}

TabButton.propTypes = {
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired
};

QuestionForm.propTypes = {
  newQuestion: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
    code: PropTypes.string,
    language: PropTypes.string,
    links: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  setNewQuestion: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default QuestionForm;