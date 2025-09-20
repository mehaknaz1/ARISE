import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Sparkles } from 'lucide-react';

const TaskForm = ({ onSubmit, onCancel, initialTask = null }) => {
  const [task, setTask] = useState({
    title: initialTask?.title || '',
    description: initialTask?.description || '',
    points: initialTask?.points || 10,
    category: initialTask?.category || 'personal',
    difficulty: initialTask?.difficulty || 'medium'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(task);
    if (!initialTask) {
      setTask({ title: '', description: '', points: 10, category: 'personal', difficulty: 'medium' });
    }
  };

  const difficultyPoints = {
    easy: 5,
    medium: 10,
    hard: 20
  };

  const handleDifficultyChange = (difficulty) => {
    setTask(prev => ({
      ...prev,
      difficulty,
      points: difficultyPoints[difficulty]
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="mb-8 border-0 shadow-xl bg-gradient-to-br from-white to-orange-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <Sparkles className="w-5 h-5 text-orange-500" />
            {initialTask ? 'Edit Task' : 'Create New Task'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                placeholder="What needs to be accomplished?"
                value={task.title}
                onChange={(e) => setTask(prev => ({ ...prev, title: e.target.value }))}
                className="text-lg border-2 border-orange-200 focus:border-orange-400 rounded-xl"
                required
              />
            </div>
            
            <div>
              <Textarea
                placeholder="Add more details about this task..."
                value={task.description}
                onChange={(e) => setTask(prev => ({ ...prev, description: e.target.value }))}
                className="h-24 border-2 border-orange-200 focus:border-orange-400 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <Select value={task.category} onValueChange={(value) => setTask(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="border-2 border-orange-200 focus:border-orange-400 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="work">🏢 Work</SelectItem>
                    <SelectItem value="personal">🏠 Personal</SelectItem>
                    <SelectItem value="fitness">💪 Fitness</SelectItem>
                    <SelectItem value="learning">📚 Learning</SelectItem>
                    <SelectItem value="creative">🎨 Creative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <Select value={task.difficulty} onValueChange={handleDifficultyChange}>
                  <SelectTrigger className="border-2 border-orange-200 focus:border-orange-400 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">🟢 Easy (5 pts)</SelectItem>
                    <SelectItem value="medium">🟡 Medium (10 pts)</SelectItem>
                    <SelectItem value="hard">🔴 Hard (20 pts)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Points Reward</label>
                <Input
                  type="number"
                  min="1"
                  value={task.points}
                  onChange={(e) => setTask(prev => ({ ...prev, points: parseInt(e.target.value) || 1 }))}
                  className="border-2 border-orange-200 focus:border-orange-400 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel} className="rounded-xl">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              )}
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-orange-500 to-teal-500 hover:from-orange-600 hover:to-teal-600 rounded-xl font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                {initialTask ? 'Update Task' : 'Create Task'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
