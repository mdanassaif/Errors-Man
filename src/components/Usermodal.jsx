// UserModal.jsx
import { X, HelpCircle, MessageCircle, Calendar } from 'lucide-react';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function UserModal({ isOpen, onClose, username, avatarUrl }) {
  const [userStats, setUserStats] = useState({
    questionCount: 0,
    answerCount: 0,
    joinDate: null,
    about: '',
    recentActivity: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && username) {
      fetchUserStats();
    }
  }, [isOpen, username]);

  const fetchUserStats = async () => {
    setIsLoading(true);
    try {
      const [{ data: questions }, { data: answers }, { data: userData }] = await Promise.all([
        supabase.from('questions').select('id, title, created_at').eq('user_id', username),
        supabase.from('answers').select('id, created_at').eq('user_id', username),
        supabase.from('users').select('*').eq('username', username).single(),
      ]);

      const recentActivity = [...(questions || []), ...(answers || [])]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

      setUserStats({
        questionCount: questions?.length || 0,
        answerCount: answers?.length || 0,
        joinDate: userData?.created_at ? new Date(userData.created_at) : null,
        about: userData?.about || '',
        recentActivity,
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">User Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={avatarUrl}
                alt={`${username}'s avatar`}
                className="w-20 h-20 rounded-full shadow-lg"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{username}</h3>
                {userStats.about && (
                  <p className="text-sm text-gray-600 mt-1">{userStats.about}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard
                icon={<Calendar className="w-4 h-4 text-blue-600" />}
                label="Member since"
                value={userStats.joinDate?.toLocaleDateString()}
              />
              <StatCard
                icon={<HelpCircle className="w-4 h-4 text-yellow-600" />}
                label="Questions"
                value={userStats.questionCount}
              />
              <StatCard
                icon={<MessageCircle className="w-4 h-4 text-green-600" />}
                label="Answers"
                value={userStats.answerCount}
              />
            </div>

            {userStats.recentActivity.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-base font-semibold text-gray-900">Recent Activity</h4>
                <div className="space-y-2">
                  {userStats.recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm text-gray-700 truncate">
                        {activity.title || 'Answered a question'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-1 mb-1">
        {icon}
        <span className="text-sm text-gray-700">{label}</span>
      </div>
      <span className="text-base font-bold text-gray-900">{value}</span>
    </div>
  );
}

UserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string.isRequired,
};