import React, { useState, useEffect } from "react";
import { Reward, UserRedemption, User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Star, Coins, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RewardsStore() {
  const [rewards, setRewards] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [isRedeeming, setIsRedeeming] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const currentUser = await User.me();
    const allRewards = await Reward.list();
    
    setUserStats(currentUser);
    setRewards(allRewards);
  };

  const handleRedeem = async (reward) => {
    if (!userStats || userStats.available_points < reward.cost) return;

    setIsRedeeming(reward.id);

    // Create redemption record
    await UserRedemption.create({
      reward_id: reward.id,
      reward_name: reward.name,
      cost: reward.cost,
      redemption_date: new Date().toISOString()
    });

    // Update user points
    const newAvailablePoints = userStats.available_points - reward.cost;
    await User.updateMyUserData({
      available_points: newAvailablePoints
    });

    setIsRedeeming(null);
    loadData();
  };

  const rarityColors = {
    common: 'bg-gray-100 text-gray-800 border-gray-300',
    rare: 'bg-blue-100 text-blue-800 border-blue-300',
    epic: 'bg-purple-100 text-purple-800 border-purple-300',
    legendary: 'bg-yellow-100 text-yellow-800 border-yellow-300'
  };

  const rarityGradients = {
    common: 'from-gray-50 to-gray-100',
    rare: 'from-blue-50 to-blue-100',
    epic: 'from-purple-50 to-purple-100',
    legendary: 'from-yellow-50 to-yellow-100'
  };

  const filteredRewards = rewards.filter(reward => {
    if (filter === 'all') return reward.available;
    if (filter === 'affordable') return reward.available && (userStats?.available_points || 0) >= reward.cost;
    return reward.available && reward.type === filter;
  });

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-teal-50/30 via-white/50 to-orange-50/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 to-orange-600 bg-clip-text text-transparent mb-2">
              Rewards Store
            </h1>
            <p className="text-gray-600">Spend your hard-earned points on amazing rewards! 🎁</p>
          </div>
          <Card className="bg-gradient-to-br from-orange-100 to-teal-100 border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-orange-600" />
                <span className="font-bold text-xl text-gray-800">
                  {userStats?.available_points || 0} Points
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {['all', 'affordable', 'badge', 'perk', 'item', 'upgrade'].map((filterOption) => (
            <Badge
              key={filterOption}
              variant={filter === filterOption ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 rounded-full px-4 py-2 ${
                filter === filterOption 
                  ? 'bg-gradient-to-r from-teal-500 to-orange-500 text-white hover:from-teal-600 hover:to-orange-600' 
                  : 'hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300'
              }`}
              onClick={() => setFilter(filterOption)}
            >
              {filterOption === 'all' ? '🌟 All' : 
               filterOption === 'affordable' ? '💰 Affordable' :
               filterOption === 'badge' ? '🏆 Badges' :
               filterOption === 'perk' ? '✨ Perks' :
               filterOption === 'item' ? '🎁 Items' :
               '⬆️ Upgrades'}
            </Badge>
          ))}
        </motion.div>

        {/* Rewards Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredRewards.map((reward, index) => {
              const canAfford = (userStats?.available_points || 0) >= reward.cost;
              
              return (
                <motion.div
                  key={reward.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className={`h-full transition-all duration-300 hover:shadow-xl ${
                    canAfford ? 'border-teal-200' : 'border-gray-200 opacity-75'
                  } bg-gradient-to-br ${rarityGradients[reward.rarity]}`}>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <Badge className={rarityColors[reward.rarity]}>
                          {reward.rarity}
                        </Badge>
                        <Badge className="bg-orange-100 text-orange-800 font-semibold">
                          <Coins className="w-3 h-3 mr-1" />
                          {reward.cost}
                        </Badge>
                      </div>
                      <div className="text-center my-4">
                        <div className="text-4xl mb-2">
                          {reward.type === 'badge' ? '🏆' :
                           reward.type === 'perk' ? '✨' :
                           reward.type === 'item' ? '🎁' :
                           '⬆️'}
                        </div>
                        <CardTitle className="text-lg font-bold">{reward.name}</CardTitle>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 mb-4 h-12 overflow-hidden">
                        {reward.description}
                      </p>
                      
                      <Button
                        onClick={() => handleRedeem(reward)}
                        disabled={!canAfford || isRedeeming === reward.id}
                        className={`w-full rounded-xl font-semibold ${
                          canAfford 
                            ? 'bg-gradient-to-r from-teal-500 to-orange-500 hover:from-teal-600 hover:to-orange-600' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {isRedeeming === reward.id ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Star className="w-4 h-4 mr-2" />
                          </motion.div>
                        ) : (
                          <ShoppingBag className="w-4 h-4 mr-2" />
                        )}
                        {canAfford ? 'Redeem' : 'Insufficient Points'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredRewards.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No rewards available</h3>
            <p className="text-gray-500">
              {filter === 'affordable' 
                ? 'Complete more tasks to earn points for rewards!' 
                : 'Check back later for new rewards!'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}