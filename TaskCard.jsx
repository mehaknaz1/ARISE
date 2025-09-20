import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Edit2, Coins } from 'lucide-react';

const TaskCard = ({ task, onComplete, onEdit, isCompleting }) => {
  const categoryIcons = {
    work: '🏢',
    personal: '🏠',
    fitness: '💪',
    learning: '📚',
    creative: '🎨'
  };

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    hard: 'bg-red-100 text-red-800 border-red-300'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className="h-full"
    >
      <Card className={`h-full transition-all duration-300 hover:shadow-lg ${
        task.completed 
          ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' 
          : 'bg-gradient-to-br from-white to-orange-50 border-orange-200'
      }`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{categoryIcons[task.category]}</span>
              <Badge className={difficultyColors[task.difficulty]}>
                {task.difficulty}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-orange-100 text-orange-800 font-semibold">
                <Coins className="w-3 h-3 mr-1" />
                {task.points} pts
              </Badge>
              {!task.completed && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(task)}
                  className="h-8 w-8 text-gray-400 hover:text-gray-600"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <h3 className={`font-bold text-lg mb-2 ${
            task.completed ? 'text-green-800 line-through' : 'text-gray-900'
          }`}>
            {task.title}
          </h3>

          {task.description && (
            <p className={`text-sm mb-4 ${
              task.completed ? 'text-green-600' : 'text-gray-600'
            }`}>
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              {new Date(task.created_date).toLocaleDateString()}
            </div>

            {!task.completed ? (
              <Button
                onClick={() => onComplete(task)}
                disabled={isCompleting}
                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 rounded-xl font-semibold"
              >
                {isCompleting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                  </motion.div>
                ) : (
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                )}
                Complete
              </Button>
            ) : (
              <Badge className="bg-green-500 text-white">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TaskCard;