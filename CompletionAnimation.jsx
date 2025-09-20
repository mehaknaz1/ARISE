import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Coins, Trophy } from 'lucide-react';

const CompletionAnimation = ({ points, onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onComplete}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-gradient-to-br from-orange-400 to-teal-500 p-8 rounded-3xl text-white text-center shadow-2xl max-w-sm mx-4"
      >
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Trophy className="w-10 h-10" />
        </motion.div>

        <h2 className="text-2xl font-bold mb-2">Task Completed!</h2>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 text-xl font-semibold mb-4"
        >
          <Coins className="w-6 h-6" />
          <span>+{points} Points Earned!</span>
        </motion.div>

        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles className="w-6 h-6 mx-auto" />
        </motion.div>

        <p className="text-sm opacity-90 mt-4">Tap anywhere to continue</p>
      </motion.div>
    </motion.div>
  );
};

export default CompletionAnimation;