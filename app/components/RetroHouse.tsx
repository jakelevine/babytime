'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Kid, KidActivity } from '../types/game';

type RetroRoomProps = {
  name: string;
  position: { x: string | number; y: number };
  kid?: Kid;
  isParentHere: boolean;
  activeActivity?: KidActivity;
  onRoomClick: () => void;
  isParentSleeping: boolean;
  roomStyle: {
    wallColor: string;
    floorColor: string;
    furniture: Array<{
      type: 'bed' | 'toybox' | 'dresser' | 'window';
      x: number;
      y: number;
    }>;
  };
};

const RetroRoom: React.FC<RetroRoomProps> = ({
  name,
  position,
  kid,
  isParentHere,
  activeActivity,
  onRoomClick,
  isParentSleeping,
  roomStyle,
}) => {
  const roomStyles: React.CSSProperties = {
    position: 'absolute',
    width: '40%',
    maxWidth: '150px',
    height: '112px',
    left: position.x,
    top: position.y,
    backgroundColor: roomStyle.wallColor,
    border: '3px solid #374151',
    borderRadius: '6px',
    boxShadow: '3px 3px 0px rgba(0, 0, 0, 0.2)',
    cursor: 'pointer',
    zIndex: 40,
    fontSize: '10px',
  };

  const floorStyles: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '50%',
    backgroundColor: roomStyle.floorColor,
    borderTop: '3px solid #4B5563',
  };

  return (
    <div style={roomStyles} onClick={onRoomClick}>
      <div style={floorStyles} />

      {/* Room name */}
      <div style={{
        position: 'absolute',
        top: '4px',
        left: '4px',
        color: '#1F2937',
        fontWeight: 'bold',
        fontSize: '10px',
        zIndex: 20,
      }}>
        {name}
      </div>

      {/* Furniture */}
      {roomStyle.furniture.map((item, index) => (
        <div
          key={`${item.type}-${index}`}
          style={{
            position: 'absolute',
            left: item.x,
            bottom: item.y,
            zIndex: 20,
            transform: 'scale(0.75)',
          }}
        >
          {item.type === 'bed' && (
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '100px',
                height: '50px',
                backgroundColor: '#B45309',
                border: '3px solid #92400E',
                borderRadius: '6px',
              }} />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100px',
                height: '25px',
                backgroundColor: '#BFDBFE',
                border: '3px solid #93C5FD',
                borderRadius: '6px 6px 0 0',
              }} />
            </div>
          )}
          {item.type === 'window' && (
            <div style={{
              width: '40px',
              height: '48px',
              backgroundColor: '#BFDBFE',
              border: '3px solid #9CA3AF',
              borderRadius: '6px',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gridTemplateRows: 'repeat(2, 1fr)',
              padding: '3px',
              gap: '3px',
            }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }} />
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Kid */}
      {kid && (
        <AnimatePresence>
          <motion.div
            style={{
              position: 'absolute',
              left: '40px',
              bottom: '20px',
              zIndex: 30,
              transformOrigin: 'center',
            }}
            initial={false}
            animate={
              activeActivity
                ? {
                    y: [-2, 2],
                    rotate: 0,
                    x: 0,
                    transition: {
                      y: {
                        duration: 0.3,
                        repeat: Infinity,
                        repeatType: 'reverse',
                      },
                    },
                  }
                : kid.isAsleep
                ? {
                    rotate: 90,
                    x: 15,
                    y: -5,
                    transition: {
                      duration: 0.5,
                      ease: "easeInOut"
                    }
                  }
                : {
                    y: [-1, 1],
                    rotate: 0,
                    x: 0,
                    transition: {
                      y: {
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'reverse',
                      },
                    },
                  }
            }
          >
            <div style={{ position: 'relative', transform: 'scale(0.75)' }}>
              {/* Progress bar for active activity */}
              {activeActivity && (
                <motion.div
                  style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '-20px',
                    width: '76px',
                    height: '4px',
                    backgroundColor: '#1F2937',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    style={{
                      height: '100%',
                      backgroundColor: '#10B981',
                    }}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{
                      duration: activeActivity.duration,
                      ease: 'linear',
                    }}
                  />
                </motion.div>
              )}
              
              {/* Kid's body */}
              <div style={{
                width: '36px',
                height: '48px',
                backgroundColor: kid.isAsleep ? '#FCD34D' : '#FBBF24',
                border: '3px solid #D97706',
                borderRadius: '12px',
              }} />
              
              {/* Kid's face */}
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '8px',
                width: '32px',
                height: '24px',
              }}>
                {kid.isAsleep ? (
                  <>
                    <div style={{
                      position: 'absolute',
                      top: '4px',
                      left: '4px',
                      width: '6px',
                      height: '3px',
                      backgroundColor: 'black',
                      borderRadius: '9999px',
                    }} />
                    <div style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      width: '6px',
                      height: '3px',
                      backgroundColor: 'black',
                      borderRadius: '9999px',
                    }} />
                    <motion.div 
                      style={{
                        position: 'absolute',
                        right: '-12px',
                        top: '-6px',
                        color: '#60A5FA',
                        fontWeight: 'bold',
                        fontSize: '12px',
                      }}
                      animate={{ 
                        opacity: [0, 1], 
                        x: [0, 8],
                        y: [-4, -8],
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      z
                    </motion.div>
                  </>
                ) : activeActivity ? (
                  <>
                    <motion.div
                      style={{
                        position: 'absolute',
                        top: '4px',
                        left: '4px',
                        width: '6px',
                        backgroundColor: '#60A5FA',
                        borderRadius: '9999px',
                      }}
                      animate={{ height: ['6px', '9px'] }}
                      transition={{ duration: 0.3, repeat: Infinity, repeatType: 'reverse' }}
                    />
                    <motion.div
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        width: '6px',
                        backgroundColor: '#60A5FA',
                        borderRadius: '9999px',
                      }}
                      animate={{ height: ['6px', '9px'] }}
                      transition={{ duration: 0.3, repeat: Infinity, repeatType: 'reverse' }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '12px',
                      height: '6px',
                      backgroundColor: '#F87171',
                      borderRadius: '9999px',
                    }} />
                  </>
                ) : (
                  <>
                    <div style={{
                      position: 'absolute',
                      top: '4px',
                      left: '4px',
                      width: '6px',
                      height: '6px',
                      backgroundColor: 'black',
                      borderRadius: '9999px',
                    }} />
                    <div style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      width: '6px',
                      height: '6px',
                      backgroundColor: 'black',
                      borderRadius: '9999px',
                    }} />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '12px',
                      height: '6px',
                      backgroundColor: '#F472B6',
                      borderRadius: '9999px',
                    }} />
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Parent */}
      {isParentHere && (
        <motion.div
          style={{
            position: 'absolute',
            right: '75px',
            bottom: '20px',
            zIndex: 30,
            transformOrigin: 'center',
          }}
          initial={{ x: 75, opacity: 0 }}
          animate={isParentSleeping ? {
            x: 0,
            opacity: 1,
            rotate: 90,
            y: -5,
          } : {
            x: 0,
            opacity: 1,
            rotate: 0,
          }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <div style={{ position: 'relative', transform: 'scale(0.75)' }}>
            {/* Parent's body */}
            <div style={{
              width: '42px',
              height: '60px',
              backgroundColor: '#3B82F6',
              border: '3px solid #1D4ED8',
              borderRadius: '12px',
            }} />
            
            {/* Parent's face */}
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '12px',
              width: '32px',
              height: '24px',
            }}>
              {isParentSleeping ? (
                <>
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    left: '4px',
                    width: '6px',
                    height: '3px',
                    backgroundColor: 'black',
                    borderRadius: '9999px',
                  }} />
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '6px',
                    height: '3px',
                    backgroundColor: 'black',
                    borderRadius: '9999px',
                  }} />
                  <motion.div 
                    style={{
                      position: 'absolute',
                      right: '-12px',
                      top: '-6px',
                      color: '#60A5FA',
                      fontWeight: 'bold',
                      fontSize: '12px',
                    }}
                    animate={{ 
                      opacity: [0, 1], 
                      x: [0, 8],
                      y: [-4, -8],
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    z
                  </motion.div>
                </>
              ) : (
                <>
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    left: '4px',
                    width: '6px',
                    height: '6px',
                    backgroundColor: 'black',
                    borderRadius: '9999px',
                  }} />
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '6px',
                    height: '6px',
                    backgroundColor: 'black',
                    borderRadius: '9999px',
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '12px',
                    height: '6px',
                    backgroundColor: '#F472B6',
                    borderRadius: '9999px',
                  }} />
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Activity name indicator */}
      {activeActivity && (
        <motion.div
          style={{
            position: 'absolute',
            top: '-16px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '2px 8px',
            backgroundColor: '#EF4444',
            color: 'white',
            borderRadius: '9999px',
            fontSize: '10px',
            fontWeight: 'bold',
            zIndex: 40,
            whiteSpace: 'nowrap',
          }}
          initial={{ scale: 0, y: 8 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          {activeActivity.name}
        </motion.div>
      )}
    </div>
  );
};

type RetroHouseProps = {
  kids: Kid[];
  activeKidIndex: number | null;
  activeActivityIndex: number | null;
  parentPosition: string;
  onRoomClick: (roomName: string) => void;
  timeElapsed: number;
};

const RetroHouse: React.FC<RetroHouseProps> = ({
  kids,
  activeKidIndex,
  activeActivityIndex,
  parentPosition,
  onRoomClick,
  timeElapsed,
}) => {
  const moonProgress = (timeElapsed / 60) * 100;
  const moonX = `${moonProgress}%`;
  const moonY = Math.sin((moonProgress / 100) * Math.PI) * -150 + 75;

  const rooms = {
    babyRoom: {
      name: "Baby",
      position: { x: '5%', y: 160 },
      style: {
        wallColor: '#ffebee',
        floorColor: '#ffe0b2',
        furniture: [
          { type: 'bed' as const, x: 12, y: 12 },
          { type: 'window' as const, x: 105, y: 35 },
        ],
      },
    },
    toddlerRoom: {
      name: "Toddler",
      position: { x: '52%', y: 160 },
      style: {
        wallColor: '#e3f2fd',
        floorColor: '#ffe0b2',
        furniture: [
          { type: 'bed' as const, x: 12, y: 12 },
          { type: 'window' as const, x: 105, y: 35 },
        ],
      },
    },
    parentRoom: {
      name: "Parent",
      position: { x: '28%', y: 320 },
      style: {
        wallColor: '#f3e5f5',
        floorColor: '#ffe0b2',
        furniture: [
          { type: 'bed' as const, x: 12, y: 12 },
          { type: 'window' as const, x: 105, y: 35 },
        ],
      },
    },
  };

  return (
    <div className="relative w-full aspect-[390/500]">
      {/* Night sky background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black rounded-lg overflow-hidden">
        {/* Moon */}
        <div 
          className="absolute w-12 h-12 transition-all duration-1000 z-20"
          style={{
            left: moonX,
            top: `${moonY}px`,
            background: 'radial-gradient(circle at center, #F3F4F6 60%, rgba(243, 244, 246, 0) 70%)',
            boxShadow: '0 0 30px 15px rgba(243, 244, 246, 0.3)',
            transform: 'translateX(-50%)',
          }}
        />

        {/* Stars */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full animate-twinkle z-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative w-full h-full">
        {/* House structure */}
        <div className="absolute inset-x-3 top-32 bottom-0 bg-gray-800 rounded-lg border-4 border-gray-700 z-10" />

        {/* Simplified Roof */}
        <div 
          className="absolute top-12 left-3 right-3 h-20 z-10"
          style={{
            clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)',
            backgroundColor: '#4B5563',
            borderBottom: '6px solid #374151',
          }}
        />

        {/* Chimney */}
        <div className="absolute top-4 right-24 w-6 h-20 bg-gray-700 z-10">
          <div className="absolute -top-3 w-8 h-4 bg-gray-600" />
        </div>

        {/* Rooms */}
        <RetroRoom
          {...rooms.babyRoom}
          kid={kids[0]}
          isParentHere={parentPosition === 'babyRoom'}
          isParentSleeping={false}
          activeActivity={
            activeKidIndex === 0 && activeActivityIndex !== null
              ? kids[0].activities[activeActivityIndex]
              : undefined
          }
          onRoomClick={() => onRoomClick('babyRoom')}
          roomStyle={rooms.babyRoom.style}
        />
        <RetroRoom
          {...rooms.toddlerRoom}
          kid={kids[1]}
          isParentHere={parentPosition === 'toddlerRoom'}
          isParentSleeping={false}
          activeActivity={
            activeKidIndex === 1 && activeActivityIndex !== null
              ? kids[1].activities[activeActivityIndex]
              : undefined
          }
          onRoomClick={() => onRoomClick('toddlerRoom')}
          roomStyle={rooms.toddlerRoom.style}
        />
        <RetroRoom
          {...rooms.parentRoom}
          isParentHere={parentPosition === 'parentRoom'}
          isParentSleeping={parentPosition === 'parentRoom' && kids.every(kid => kid.isAsleep)}
          onRoomClick={() => onRoomClick('parentRoom')}
          roomStyle={rooms.parentRoom.style}
        />
      </div>
    </div>
  );
};

export default RetroHouse; 