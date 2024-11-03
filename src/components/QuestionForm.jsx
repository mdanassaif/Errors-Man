// QuestionForm.jsx
import { Send, Link as LinkIcon, Code } from 'lucide-react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function QuestionForm({ newQuestion, setNewQuestion, onSubmit }) {
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'code', 'links'

  const programmingLanguages = [
    'javascript', 'python', 'java', 'cpp', 'csharp', 'php', 'ruby',
    'typescript', 'html', 'css'
  ];

  const handleAddLink = (e) => {
    e.preventDefault();
    const link = e.target.link.value;
    if (link && new URL(link)) {
      setNewQuestion(prev => ({
        ...prev,
        links: [...(prev.links || []), link]
      }));
      e.target.reset();
    }
  };

  const renderDetailsTab = () => (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="What's your programming question?"
        className="w-full p-3 rounded-lg bg-gray-100 border-2 border-transparent focus:border-yellow-500 transition-all"
        value={newQuestion.title}
        onChange={(e) => setNewQuestion(prev => ({ ...prev, title: e.target.value }))}
      />

      <textarea
        placeholder="Describe your problem in detail..."
        className="w-full p-3 rounded-lg bg-gray-100 border-2 border-transparent focus:border-yellow-500 transition-all"
        rows="4"
        value={newQuestion.content}
        onChange={(e) => setNewQuestion(prev => ({ ...prev, content: e.target.value }))}
      />
    </div>
  );

  const renderCodeTab = () => (
    <div className="space-y-4">
      <select
        className="w-full p-3 rounded-lg bg-gray-100"
        value={newQuestion.language}
        onChange={(e) => setNewQuestion(prev => ({ ...prev, language: e.target.value }))}
      >
        <option value="">Select Programming Language</option>
        {programmingLanguages.map(lang => (
          <option key={lang} value={lang}>{lang.toUpperCase()}</option>
        ))}
      </select>

      <textarea
        placeholder="Paste your code here..."
        className="w-full p-3 rounded-lg bg-gray-100 font-mono border-2 border-transparent focus:border-yellow-500"
        rows="8"
        value={newQuestion.code}
        onChange={(e) => setNewQuestion(prev => ({ ...prev, code: e.target.value }))}
      />

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
          className="flex-1 p-3 rounded-lg bg-gray-100"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
        >
          Add
        </button>
      </form>

      {newQuestion.links?.length > 0 && (
        <div className="space-y-2">
          {newQuestion.links.map((link, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
              <a href={link} target="_blank" rel="noopener noreferrer" className="flex-1 truncate hover:text-yellow-500">
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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex gap-4 mb-6">
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

      <div className="mt-6 flex justify-end">
        <button
          onClick={onSubmit}
          className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Post Question
        </button>
      </div>
    </div>
  );
}
TabButton.propTypes = {
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired
};
function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all
        ${active
          ? 'bg-yellow-500 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
    >
      {icon}
      {label}
    </button>
  );
}

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