// import { useState } from 'react';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// export const GeneratePage = () => {
//   const [insightType, setInsightType] = useState('dsa');
//   const [insights, setInsights] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_GENAI_API_KEY || '';
//   const genAI = new GoogleGenerativeAI(API_KEY);

//   const generateProfessionalColor = () => {
//     const colors = [
//       'bg-gradient-to-r from-yellow-100 to-yellow-200',
//       'bg-gradient-to-r from-blue-100 to-blue-200',
//       'bg-gradient-to-r from-green-100 to-green-200',
//       'bg-gradient-to-r from-purple-100 to-purple-200',
//       'bg-gradient-to-r from-pink-100 to-pink-200',
//     ];
//     return colors[Math.floor(Math.random() * colors.length)];
//   };

//   const fetchCodingInsights = async () => {
//     setIsLoading(true);
//     try {
//       const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

//       const prompts = {
//         dsa: `Explain a key Data Structures and Algorithms concept in simple terms. Include:
//         1. A clear title
//         2. A brief explanation
//         3. A practical example`,
//         'coding-trends': `Describe a current trend in software development. Include:
//         1. The trend name
//         2. Its importance
//         3. How to get started`,
//         'interview-prep': `Provide a tip for coding interviews. Include:
//         1. The tip
//         2. Why it's useful
//         3. An example`,
//       };

//       const prompt = prompts[insightType];
//       const result = await model.generateContent(prompt);
//       const response = await result.response.text();

//       const parseInsights = (text) => {
//         const sections = text.split(/\d\.\s*/).filter((section) => section.trim());
//         return sections.map((section, index) => ({
//           title: index === 0 ? 'Key Insight' : `Insight ${index}`,
//           content: section.trim(),
//           bgColor: generateProfessionalColor(),
//         }));
//       };

//       const parsedInsights = parseInsights(response);
//       setInsights(parsedInsights);
//     } catch (error) {
//       console.error('Error fetching insights:', error);
//       toast.error('Failed to generate insights. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="text-center mb-10">
//         <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-4">
//           Generate Insights
//         </h1>
//         <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
//           Unlock advanced coding knowledge, strategies, and tech insights.
//         </p>
//       </div>

//       <div className="flex justify-center mb-8">
//         <select
//           value={insightType}
//           onChange={(e) => setInsightType(e.target.value)}
//           className="mr-4 p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
//         >
//           <option value="dsa">DSA Concepts</option>
//           <option value="coding-trends">Tech Trends</option>
//           <option value="interview-prep">Interview Strategies</option>
//         </select>

//         <button
//           onClick={fetchCodingInsights}
//           disabled={isLoading}
//           className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
//         >
//           {isLoading ? (
//             <>
//               <svg
//                 className="animate-spin h-5 w-5 mr-3"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 ></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                 ></path>
//               </svg>
//               Generating...
//             </>
//           ) : (
//             'Generate Insights'
//           )}
//         </button>
//       </div>

//       <div className="grid md:grid-cols-1 gap-6">
//         {isLoading ? (
//           // Skeleton Loading
//           Array.from({ length: 3 }).map((_, index) => (
//             <div
//               key={index}
//               className="p-6 rounded-xl shadow-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 animate-pulse"
//             >
//               <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
//               <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
//               <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
//               <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
//             </div>
//           ))
//         ) : (
//           insights.map((insight, index) => (
//             <div
//               key={index}
//               className={`p-6 rounded-xl shadow-lg transform transition-all hover:scale-105 ${insight.bgColor}`}
//             >
//               <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
//                 {insight.title}
//               </h2>
//               <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
//                 {insight.content}
//               </p>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };