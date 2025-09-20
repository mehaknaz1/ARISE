import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const StatsCards = ({ stats, isLoading }) => {
  const cards = [
    {
      title: "Available Points",
      value: stats?.available_points || 0,
      icon: "🪙",
      gradient: "from-orange-400 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100"
    },
    {
      title: "Total Earned",
      value: stats?.total_points || 0,
      icon: "💎",
      gradient: "from-teal-400 to-teal-600",
      bgGradient: "from-teal-50 to-teal-100"
    },
    {
      title: "Tasks Complete",
      value: stats?.tasks_completed || 0,
      icon: "✅",
      gradient: "from-green-400 to-green-600",
      bgGradient: "from-green-50 to-green-100"
    },
    {
      title: "Current Level",
      value: stats?.level || 1,
      icon: "⭐",
      gradient: "from-yellow-400 to-yellow-600",
      bgGradient: "from-yellow-50 to-yellow-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className={`bg-gradient-to-br ${card.bgGradient} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className={`text-3xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent mt-2`}>
                    {isLoading ? "..." : card.value}
                  </p>
                </div>
                <div className="text-3xl opacity-80">{card.icon}</div>
              </div>
              {card.title === "Current Level" && (
                <Badge className="mt-2 bg-yellow-200 text-yellow-800 border-yellow-300">
                  {Math.floor(((stats?.total_points || 0) % 100) / 10) * 10}% to next level
                </Badge>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;