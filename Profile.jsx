import React, { useState, useEffect } from "react";
import { User, UserRedemption } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User as UserIcon, Trophy, Coins, Calendar, Gift } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [redemptions, setRedemptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    const currentUser = await User.me();
    const userRedemptions = await UserRedemption.filter({ created_by: currentUser.email }, '-redemption_date');
    
    setUser(currentUser);
    setRedemptions(userRedemptions);
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await User.logout();
  };

  const getProgressToNextLevel = () => {
    if (!user) return 0;
    const currentLevelPoints = (user.level - 1) * 100;
    const nextLevelPoints = user.level * 100;
    const progress = ((user.total_points - currentLevelPoints) / 100) * 100;
    return Math.min(progress, 100);
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-purple-50/30 via-white/50 to-orange-50/30">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent mb-2">
            Profile
          </h1>
          <p className="text-gray-600">Track your progress and achievements! 📊</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="bg-gradient-to-br from-purple-100 to-orange-100 border-0 shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
                  {user?.full_name?.[0]?.toUpperCase() || 'U'}
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {user?.full_name || 'Player'}
                </h2>
                <p className="text-gray-600 mb-4">{user?.email}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Level</span>
                    <Badge className="bg-purple-500 text-white">
                      Level {user?.level || 1}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${getProgressToNextLevel()}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="bg-gradient-to-r from-purple-500 to-orange-500 h-3 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {Math.round(getProgressToNextLevel())}% to Level {(user?.level || 1) + 1}
                  </p>
                </div>

                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  className="w-full rounded-xl"
                >
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats & Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Coins className="w-8 h-8 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600">Available Points</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {user?.available_points || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-teal-500" />
                    <div>
                      <p className="text-sm text-gray-600">Total Points</p>
                      <p className="text-2xl font-bold text-teal-600">
                        {user?.total_points || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600">Tasks Completed</p>
                      <p className="text-2xl font-bold text-green-600">
                        {user?.tasks_completed || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Gift className="w-8 h-8 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-600">Rewards Claimed</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {redemptions.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Redemptions */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-purple-500" />
                  Recent Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                {redemptions.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">🎁</div>
                    <p className="text-gray-500">No rewards claimed yet!</p>
                    <p className="text-sm text-gray-400 mt-1">Visit the Rewards Store to spend your points.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {redemptions.slice(0, 5).map((redemption, index) => (
                      <motion.div
                        key={redemption.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            🏆
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {redemption.reward_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(redemption.redemption_date), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-orange-100 text-orange-800">
                          -{redemption.cost} pts
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}