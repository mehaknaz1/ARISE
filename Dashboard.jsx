import React, { useState, useEffect } from "react";
import { Task, User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Filter } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import StatsCards from "../components/dashboard/StatsCards";
import TaskForm from "../components/dashboard/TaskForm";
import TaskCard from "../components/dashboard/TaskCard";
import CompletionAnimation from "../components/dashboard/CompletionAnimation";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [completingTask, setCompletingTask] = useState(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [completedPoints, setCompletedPoints] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const currentUser = await User.me();
    const userTasks = await Task.filter({ created_by: currentUser.email }, '-created_date');
    
    setUser(currentUser);
    setTasks(userTasks);
    setUserStats(currentUser);
    setIsLoading(false);
  };

  const handleCreateTask = async (taskData) => {
    await Task.create(taskData);
    setShowForm(false);
    setEditingTask(null);
    loadData();
  };

  const handleEditTask = async (taskData) => {
    await Task.update(editingTask.id, taskData);
    setEditingTask(null);
    loadData();
  };

  const handleCompleteTask = async (task) => {
    setCompletingTask(task.id);
    
    // Mark task as completed
    await Task.update(task.id, { 
      completed: true, 
      completed_at: new Date().toISOString() 
    });

    // Update user stats
    const newTotalPoints = (userStats.total_points || 0) + task.points;
    const newAvailablePoints = (userStats.available_points || 0) + task.points;
    const newTasksCompleted = (userStats.tasks_completed || 0) + 1;
    const newLevel = Math.floor(newTotalPoints / 100) + 1;

    await User.updateMyUserData({
      total_points: newTotalPoints,
      available_points: newAvailablePoints,
      tasks_completed: newTasksCompleted,
      level: newLevel
    });

    setCompletedPoints(task.points);
    setShowCompletion(true);
    setCompletingTask(null);
    
    setTimeout(() => {
      loadData();
    }, 1000);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return task.category === filter;
  });

  const categories = ['all', 'pending', 'completed', 'work', 'personal', 'fitness', 'learning', 'creative'];

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-orange-50/30 via-white/50 to-teal-50/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Task Dashboard
            </h1>
            <p className="text-gray-600">Complete tasks, earn points, level up! 🚀</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-orange-500 to-teal-500 hover:from-orange-600 hover:to-teal-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Task
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <StatsCards stats={userStats} isLoading={isLoading} />

        {/* Task Form */}
        <AnimatePresence>
          {showForm && (
            <TaskForm
              onSubmit={editingTask ? handleEditTask : handleCreateTask}
              onCancel={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
              initialTask={editingTask}
            />
          )}
        </AnimatePresence>

        {/* Filter Tabs */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          <div className="flex items-center gap-2 mr-4">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
          </div>
          {categories.map((category) => (
            <Badge
              key={category}
              variant={filter === category ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 rounded-full px-4 py-2 ${
                filter === category 
                  ? 'bg-gradient-to-r from-orange-500 to-teal-500 text-white hover:from-orange-600 hover:to-teal-600' 
                  : 'hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300'
              }`}
              onClick={() => setFilter(category)}
            >
              {category === 'all' ? '🌟 All' : 
               category === 'pending' ? '⏳ Pending' :
               category === 'completed' ? '✅ Completed' :
               category === 'work' ? '🏢 Work' :
               category === 'personal' ? '🏠 Personal' :
               category === 'fitness' ? '💪 Fitness' :
               category === 'learning' ? '📚 Learning' :
               '🎨 Creative'}
            </Badge>
          ))}
        </motion.div>

        {/* Tasks Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={handleCompleteTask}
                onEdit={(task) => {
                  setEditingTask(task);
                  setShowForm(true);
                }}
                isCompleting={completingTask === task.id}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredTasks.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-4">
              {filter === 'all' ? 'Create your first task to get started!' : `No ${filter} tasks yet.`}
            </p>
            <Button
              onClick={() => setShowForm(true)}
              variant="outline"
              className="rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          </motion.div>
        )}

        {/* Completion Animation */}
        <AnimatePresence>
          {showCompletion && (
            <CompletionAnimation
              points={completedPoints}
              onComplete={() => setShowCompletion(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}