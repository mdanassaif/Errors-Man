import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy, Loader, X, Medal, Award, Star } from 'lucide-react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
    setupRealtime();
    return () => supabase.removeAllChannels();
  }, []);

  const fetchData = async () => {
    try {
      const [{ data: questions }, { data: answers }] = await Promise.all([
        supabase.from('questions').select('user_id'),
        supabase.from('answers').select('user_id')
      ]);

      const users = {};
      
      questions?.forEach(q => {
        users[q.user_id] = users[q.user_id] || { points: 0, questions: 0, answers: 0 };
        users[q.user_id].points += 2;
        users[q.user_id].questions += 1;
      });

      answers?.forEach(a => {
        users[a.user_id] = users[a.user_id] || { points: 0, questions: 0, answers: 0 };
        users[a.user_id].points += 1;
        users[a.user_id].answers += 1;
      });

      const topUsers = Object.entries(users)
        .map(([username, stats]) => ({ username, ...stats }))
        .sort((a, b) => b.points - a.points)
        .slice(0, 7);

      setLeaderboard(topUsers);
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  const setupRealtime = () => {
    supabase
      .channel('changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'questions' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'answers' }, fetchData)
      .subscribe();
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Award className="h-5 w-5 text-amber-700" />;
      default:
        return <Star className="h-4 w-4 text-blue-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-8 w-8 text-yellow-600" />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="text-center mb-8">
        <p className="text-gray-600 text-sm">Top contributors making a difference</p>
      </div>

      <div className="space-y-4">
        {leaderboard.map((user, index) => (
          <div 
            key={user.username} 
            className={`
              ${index === 0 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200' : 
                index === 1 ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-200' :
                index === 2 ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200' :
                'bg-white border-blue-100'
              } 
              p-4 rounded-xl  border transition-all 
            `}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white ">
                  <span className="font-bold text-gray-700 text-sm">#{index + 1}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800 text-sm">{user.username}</span>
                    {getRankIcon(index)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    <span className="text-yellow-700">{user.questions} Questions</span> · 
                    <span className="text-blue-700"> {user.answers} Answers</span>
                  </div>
                </div>
              </div>
              <div className="font-bold text-sm text-yellow-800">{user.points} pts</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-white p-6 rounded-xl">
        <h3 className="text-lg font-bold text-gray-800 mb-4">ErrorMan Guidelines</h3>
        <div className="space-y-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            View Complete Rules
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-800 mb-6">Community Rules</h3>

            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2 text-sm">Point System</h4>
                <ul className="list-disc pl-4 space-y-2 text-gray-700 text-sm">
                  <li>Asking a question earns 2 points</li>
                  <li>Providing an answer earns 1 point</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2 text-sm">Participation Guidelines</h4>
                <ul className="list-disc pl-4 space-y-2 text-gray-700 text-sm">
                  <li>Be respectful and supportive to all community members</li>
                  <li>Ask clear, well-researched questions</li>
                  <li>Provide detailed, helpful answers</li>
                  <li>Use appropriate tags and formatting</li>
                  <li>Avoid duplicate questions</li>
                  <li>Report inappropriate content</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2 text-sm">Quality Standards</h4>
                <ul className="list-disc pl-4 space-y-2 text-gray-700 text-sm">
                  <li>Include relevant code examples when possible</li>
                  <li>Properly format code blocks</li>
                  <li>Cite sources when referencing external content</li>
                  <li>Keep discussions on-topic</li>
                  <li>Edit and improve your posts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;