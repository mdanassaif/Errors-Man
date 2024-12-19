import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const GeneratePage = () => {
  const [insightType, setInsightType] = useState('dsa');
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

 
  const API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_GENAI_API_KEY || '';
  const genAI = new GoogleGenerativeAI(API_KEY);

  const generateProfessionalColor = () => {
    const colors = [
      'bg-yellow-100', 
      'bg-yellow-200', 
      'bg-yellow-300', 
      'bg-yellow-400', 
      'bg-yellow-500'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const fetchCodingInsights = async () => {
    setIsLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompts = {
        'dsa': `Generate an advanced explanation of a key Data Structures and Algorithms concept. 
        Provide a structured response with:
        1. A clear, professional title
        2. A detailed technical explanation
        3. Practical implementation tips
        4. Potential interview insights`,
        
        'coding-trends': `Provide a comprehensive insight into current software development trends:
        1. Emerging technology or programming paradigm
        2. Potential impact on software engineering
        3. Key takeaways for professional developers
        4. Real-world application examples`,
        
        'interview-prep': `Create a comprehensive coding interview preparation insight:
        1. Specific algorithm or problem-solving strategy
        2. Common interview approaches
        3. Advanced technical interview tips
        4. Recommended preparation resources`
      };

      const prompt = prompts[insightType];
      const result = await model.generateContent(prompt);
      const response = await result.response.text();

      const parseInsights = (text) => {
        const sections = text.split(/\d\.\s*/).filter(section => section.trim());
        return sections.map((section, index) => ({
          title: index === 0 ? 'Key Insight' : `Insight ${index}`,
          content: section.trim(),
          bgColor: generateProfessionalColor()
        }));
      };

      const parsedInsights = parseInsights(response);
      setInsights(parsedInsights);
    } catch (error) {
      console.error('Error fetching insights:', error);
      alert('Failed to generate coding insights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="coding-insight-hub container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Generate Stuffs with choice
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Unlock advanced coding knowledge strategies, and tech insights.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <select 
          value={insightType}
          onChange={(e) => setInsightType(e.target.value)}
          className="mr-4 p-3 border-2 border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          <option value="dsa">DSA Concepts</option>
          <option value="coding-trends">Tech Trends</option>
          <option value="interview-prep">Interview Strategies</option>
        </select>

        <button 
          onClick={fetchCodingInsights}
          disabled={isLoading}
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg 
                       transition-colors 
                     disabled:opacity-50 flex items-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Generate Insights'
          )}
        </button>
      </div>

      <div className="grid md:grid-cols-1 gap-6">
        {insights.map((insight, index) => (
          <div 
            key={index} 
            className={`p-6 rounded-xl shadow-lg transform transition-all 
                          ${insight.bgColor}`}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {insight.title}
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {insight.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};