import React, { useState, useEffect } from "react";
import { User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Crown } from "lucide-react";
import { motion } from "framer-motion";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    const me = await User.me();
    const allUsers = await User.list();
    
    // Sort by total points descending
    const sortedUsers = allUsers
      .filter(user => (user.total_points || 0) > 0)
      .sort((a, b) => (b.total_points || 0) - (a.total_points || 0));

    setUsers(sortedUsers);
    setCurrentUser(me);
    setIsLoading(false);
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Trophy className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-500" />;
    return <Award className="w-5 h-5 text-gray-400" />;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600';
    if (rank === 2) return 'from-gray-400 to-gray-600';
    if (rank === 3) return 'from-orange-400 to-orange-600';
    return 'from-gray-300 to-gray-500';
  };

  const getCurrentUserRank = () => {
    const rank = users.findIndex(user => user.email === currentUser?.email) + 1;
    return rank > 0 ? rank : '—';
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-yellow-50/30 via-white/50 to-purple-50/30">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Leaderboard
          </h1>
          <p className="text-gray-600">See how you rank against other players! 🏆</p>
        </motion.div>

        {/* Current User Stats */}
        {currentUser && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-br from-purple-100 to-yellow-100 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {currentUser.full_name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">Your Stats</h3>
                      <p className="text-gray-600">{currentUser.full_name || 'Player'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">
                      #{getCurrentUserRank()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {currentUser.total_points || 0} points
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Leaderboard */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Top Players
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Loading leaderboard...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-6xl mb-4">🏁</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No players yet!</h3>
                <p className="text-gray-500">Complete some tasks to appear on the leaderboard.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {users.map((user, index) => {
                  const rank = index + 1;
                  const isCurrentUser = user.email === currentUser?.email;
                  
                  return (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center justify-between p-4 transition-all duration-200 ${
                        isCurrentUser 
                          ? 'bg-gradient-to-r from-purple-100 to-yellow-100 border-2 border-purple-200' 
                          : 'hover:bg-gray-50'
                      } ${rank <= 3 ? 'border-l-4 border-yellow-400' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Rank */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r ${getRankColor(rank)} text-white font-bold`}>
                          {rank <= 3 ? getRankIcon(rank) : rank}
                        </div>

                        {/* User Info */}
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                            isCurrentUser 
                              ? 'bg-gradient-to-br from-purple-400 to-yellow-400' 
                              : 'bg-gradient-to-br from-gray-400 to-gray-600'
                          }`}>
                            {user.full_name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className={`font-semibold ${isCurrentUser ? 'text-purple-700' : 'text-gray-900'}`}>
                              {user.full_name || 'Player'}
                              {isCurrentUser && <span className="ml-2 text-sm text-purple-600">(You)</span>}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-blue-100 text-blue-800 text-xs">
                                Level {user.level || 1}
                              </Badge>
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                {user.tasks_completed || 0} tasks
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Points */}
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          {user.total_points || 0}
                        </div>
                        <div className="text-sm text-gray-500">points</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}