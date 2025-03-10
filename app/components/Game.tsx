'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GameState, Kid, KidActivity, ACTIVITY_DURATIONS, CYCLE_LENGTH } from '../types/game';
import RetroHouse from './RetroHouse';

const initialKids: Kid[] = [
  {
    name: 'Baby',
    isAsleep: true,
    activities: [
      {
        name: 'Soothe',
        duration: ACTIVITY_DURATIONS.SHORT,
        isInProgress: false,
        cooldown: 15,
        lastCompletedAt: null,
      },
      {
        name: 'Change Diaper',
        duration: ACTIVITY_DURATIONS.MEDIUM,
        isInProgress: false,
        cooldown: 30,
        lastCompletedAt: null,
      },
      {
        name: 'Give Bottle',
        duration: ACTIVITY_DURATIONS.LONG,
        isInProgress: false,
        cooldown: 45,
        lastCompletedAt: null,
      },
    ],
  },
  {
    name: 'Toddler',
    isAsleep: true,
    activities: [
      {
        name: 'Fix Blanket',
        duration: ACTIVITY_DURATIONS.SHORT,
        isInProgress: false,
        cooldown: 20,
        lastCompletedAt: null,
      },
      {
        name: 'Potty Break',
        duration: ACTIVITY_DURATIONS.MEDIUM,
        isInProgress: false,
        cooldown: 35,
        lastCompletedAt: null,
      },
      {
        name: 'Handle Night Terror',
        duration: ACTIVITY_DURATIONS.LONG,
        isInProgress: false,
        cooldown: 50,
        lastCompletedAt: null,
      },
    ],
  },
];

const initialGameState: GameState = {
  timeElapsed: 0,
  cycleTime: CYCLE_LENGTH,
  parentSleepTime: 0,
  isParentSleeping: false,
  kids: initialKids,
};

export default function Game() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [activeKidIndex, setActiveKidIndex] = useState<number | null>(null);
  const [activeActivityIndex, setActiveActivityIndex] = useState<number | null>(null);
  const [parentPosition, setParentPosition] = useState('parentRoom');
  const [gameResult, setGameResult] = useState<'complete' | null>(null);

  useEffect(() => {
    if (!isGameRunning) return;

    const gameLoop = setInterval(() => {
      setGameState((prevState) => {
        const newState = { ...prevState };
        newState.timeElapsed += 1;

        // Update kids' states
        newState.kids = newState.kids.map((kid, index) => {
          const newKid = { ...kid };

          // Handle wake-up events
          if (newKid.isAsleep && Math.random() < 0.15) { // 15% chance per second to wake up
            // Only wake up if at least one activity is available
            const hasAvailableActivity = newKid.activities.some(activity => 
              !activity.isInProgress && (!activity.lastCompletedAt || newState.timeElapsed - activity.lastCompletedAt >= activity.cooldown)
            );
            
            if (hasAvailableActivity) {
              newKid.isAsleep = false;
            }
          }

          // Handle activity completion
          if (index === activeKidIndex && activeActivityIndex !== null) {
            const activity = newKid.activities[activeActivityIndex];
            if (activity.isInProgress) {
              if (newState.timeElapsed - activity.lastCompletedAt! >= activity.duration) {
                activity.isInProgress = false;
                newKid.isAsleep = true;
                setGameState(prev => {
                  const updatedState = { ...prev };
                  updatedState.kids[index].isAsleep = true;
                  updatedState.kids[index].activities[activeActivityIndex].isInProgress = false;
                  return updatedState;
                });
                requestAnimationFrame(() => {
                  setActiveKidIndex(null);
                  setActiveActivityIndex(null);
                  setParentPosition('parentRoom');
                });
              }
            }
          }

          // Update activity cooldowns
          newKid.activities = newKid.activities.map(activity => {
            if (!activity.isInProgress && activity.lastCompletedAt !== null) {
              if (newState.timeElapsed - activity.lastCompletedAt >= activity.cooldown) {
                return { ...activity, lastCompletedAt: null };
              }
            }
            return activity;
          });

          return newKid;
        });

        // Update parent sleep state
        const awakeKidsCount = newState.kids.filter(kid => !kid.isAsleep).length;
        const canParentSleep = awakeKidsCount === 0 && parentPosition === 'parentRoom';
        
        if (canParentSleep) {
          newState.isParentSleeping = true;
          newState.parentSleepTime += 1;
        } else {
          newState.isParentSleeping = false;
        }

        // Check if cycle is complete
        if (newState.timeElapsed >= newState.cycleTime) {
          setIsGameRunning(false);
          setGameResult('complete');
        }

        return newState;
      });
    }, 1000);

    return () => clearInterval(gameLoop);
  }, [isGameRunning, activeKidIndex, activeActivityIndex, parentPosition]);

  const handleRoomClick = (roomName: string) => {
    if (!isGameRunning) return;

    const kidIndex = roomName === 'babyRoom' ? 0 : roomName === 'toddlerRoom' ? 1 : null;

    // If clicking parent room and all kids are asleep, let parent sleep
    if (roomName === 'parentRoom' && gameState.kids.every(kid => kid.isAsleep)) {
      setParentPosition('parentRoom');
      return;
    }

    if (kidIndex === null) return;

    // Don't allow interaction if an activity is in progress
    if (activeKidIndex !== null || activeActivityIndex !== null) return;

    const kid = gameState.kids[kidIndex];
    
    // Only allow interaction if kid is awake
    if (kid.isAsleep) return;

    // Check each activity's status
    const availableActivities = kid.activities.map((activity, index) => ({
      index,
      name: activity.name,
      available: !activity.isInProgress && (!activity.lastCompletedAt || gameState.timeElapsed - activity.lastCompletedAt >= activity.cooldown),
      cooldownRemaining: activity.lastCompletedAt ? Math.max(0, activity.cooldown - (gameState.timeElapsed - activity.lastCompletedAt)) : 0
    }));

    console.log('Available activities:', availableActivities);

    const availableActivity = availableActivities.find(a => a.available)?.index ?? -1;

    if (availableActivity !== -1) {
      setGameState(prev => {
        const newState = { ...prev };
        newState.kids[kidIndex].activities[availableActivity].isInProgress = true;
        newState.kids[kidIndex].activities[availableActivity].lastCompletedAt = newState.timeElapsed;
        return newState;
      });
      setActiveKidIndex(kidIndex);
      setActiveActivityIndex(availableActivity);
      setParentPosition(roomName);
    }
  };

  const handleRestart = () => {
    setGameState(initialGameState);
    setIsGameRunning(true);
    setActiveKidIndex(null);
    setActiveActivityIndex(null);
    setParentPosition('parentRoom');
    setGameResult(null);
  };

  const getSleepQualityMessage = (sleepTime: number) => {
    if (sleepTime < 3) {
      return {
        message: "Not great, you're about to have a shitty day",
        gradient: "from-red-500 to-red-600",
        emoji: "☠️"
      };
    } else if (sleepTime < 6) {
      return {
        message: "Maybe only one person will say 'you look tired'",
        gradient: "from-orange-400 to-orange-500",
        emoji: "😫"
      };
    } else if (sleepTime < 10) {
      return {
        message: "Wow, you just might make it with a few cups of coffee",
        gradient: "from-yellow-400 to-yellow-500",
        emoji: "☕"
      };
    } else if (sleepTime < 15) {
      return {
        message: "Look at you, practically a functional human being!",
        gradient: "from-green-400 to-green-500",
        emoji: "🌟"
      };
    } else {
      return {
        message: "What sorcery is this? Are you even a parent?",
        gradient: "from-purple-400 to-purple-500",
        emoji: "🧙‍♂️"
      };
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-lg mx-auto space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center bg-gray-900 p-4 rounded-lg">
          <h1 className="text-2xl sm:text-3xl font-bold pixel-art bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">Sleep Regression</h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => !gameResult && setIsGameRunning(!isGameRunning)}
              className="px-3 py-2 bg-blue-500 rounded retro-border hover:bg-blue-600 transition-colors font-bold text-sm"
            >
              {isGameRunning ? '⏸' : '▶'}
            </button>
            <div className="text-sm bg-gray-800 px-2 py-1 rounded retro-shadow">
              🕒 {Math.floor((gameState.cycleTime - gameState.timeElapsed) / 60)}:
              {((gameState.cycleTime - gameState.timeElapsed) % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Game Over Overlay */}
        {gameResult && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="bg-gray-900 p-8 rounded-xl text-center space-y-6 max-w-md mx-4"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 12 }}
            >
              {(() => {
                const quality = getSleepQualityMessage(Math.floor(gameState.parentSleepTime));
                return (
                  <>
                    <motion.div
                      className="text-6xl mb-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                    >
                      {quality.emoji}
                    </motion.div>
                    <motion.h2
                      className={`text-3xl font-bold pixel-art bg-gradient-to-r ${quality.gradient} text-transparent bg-clip-text`}
                      initial={{ y: -20 }}
                      animate={{ y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {Math.floor(gameState.parentSleepTime)} seconds of sleep
                    </motion.h2>
                    <motion.p
                      className="text-gray-300 text-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      {quality.message}
                    </motion.p>
                    <motion.button
                      className="px-6 py-3 bg-blue-500 rounded-lg font-bold hover:bg-blue-600 transition-colors retro-border"
                      onClick={handleRestart}
                      initial={{ y: 20 }}
                      animate={{ y: 0 }}
                      transition={{ delay: 0.9 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Try Again
                    </motion.button>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}

        {/* Parent Status */}
        <div className="bg-gray-900 p-4 rounded-lg retro-shadow">
          <div className="flex justify-between items-center">
            <div className="space-y-2 flex-1 mr-3">
              <div className="w-full bg-gray-800 rounded-full h-4 retro-border overflow-hidden">
                <div
                  className="bg-purple-500 h-full transition-all duration-300"
                  style={{
                    width: `${(gameState.parentSleepTime / CYCLE_LENGTH) * 100}%`,
                  }}
                />
              </div>
              <p className="text-sm font-bold">
                Sleep: {Math.floor(gameState.parentSleepTime)} seconds
              </p>
            </div>
            <div
              className={`text-2xl ${
                gameState.isParentSleeping ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {gameState.isParentSleeping ? '😴' : '👀'}
            </div>
          </div>
        </div>

        {/* Game view */}
        <div className="bg-gray-900 p-4 rounded-lg mt-8">
          <RetroHouse
            kids={gameState.kids}
            activeKidIndex={activeKidIndex}
            activeActivityIndex={activeActivityIndex}
            parentPosition={parentPosition}
            onRoomClick={handleRoomClick}
            timeElapsed={gameState.timeElapsed}
          />
        </div>
      </div>
    </div>
  );
} 