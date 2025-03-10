'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { Kid, KidActivity } from '../types/game';

type Position = {
  x: number;
  y: number;
};

type RoomProps = {
  name: string;
  position: Position;
  size: { width: number; height: number };
  kid?: Kid;
  isParentHere: boolean;
  activeActivity?: KidActivity;
  onRoomClick: () => void;
};

const Room: React.FC<RoomProps> = ({ name, position, size, kid, isParentHere, activeActivity, onRoomClick }) => {
  return (
    <div
      className="absolute border-2 border-gray-600 rounded-lg p-4 cursor-pointer transition-colors"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        backgroundColor: isParentHere ? 'rgba(59, 130, 246, 0.2)' : 'rgba(31, 41, 55, 0.4)',
      }}
      onClick={onRoomClick}
    >
      <div className="text-sm font-bold mb-2">{name}</div>
      {kid && (
        <div className="relative">
          <motion.div
            className="w-8 h-8 bg-yellow-400 rounded-full"
            animate={{
              scale: kid.isAsleep ? 0.8 : 1,
              opacity: kid.isAsleep ? 0.6 : 1,
            }}
          />
          {activeActivity && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-4 -right-4"
            >
              <ExclamationCircleIcon className="w-6 h-6 text-red-500" />
            </motion.div>
          )}
        </div>
      )}
      {isParentHere && (
        <motion.div
          className="w-8 h-8 bg-blue-500 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        />
      )}
    </div>
  );
};

type HouseProps = {
  kids: Kid[];
  activeKidIndex: number | null;
  activeActivityIndex: number | null;
  parentPosition: string;
  onRoomClick: (roomName: string) => void;
};

const House: React.FC<HouseProps> = ({
  kids,
  activeKidIndex,
  activeActivityIndex,
  parentPosition,
  onRoomClick,
}) => {
  const rooms = {
    babyRoom: {
      name: "Baby's Room",
      position: { x: 50, y: 50 },
      size: { width: 200, height: 150 },
    },
    toddlerRoom: {
      name: "Toddler's Room",
      position: { x: 300, y: 50 },
      size: { width: 200, height: 150 },
    },
    parentRoom: {
      name: "Parent's Room",
      position: { x: 175, y: 250 },
      size: { width: 200, height: 150 },
    },
  };

  return (
    <div className="relative w-[550px] h-[450px] bg-gray-800 rounded-xl p-4">
      <Room
        {...rooms.babyRoom}
        kid={kids[0]}
        isParentHere={parentPosition === 'babyRoom'}
        activeActivity={
          activeKidIndex === 0 && activeActivityIndex !== null
            ? kids[0].activities[activeActivityIndex]
            : undefined
        }
        onRoomClick={() => onRoomClick('babyRoom')}
      />
      <Room
        {...rooms.toddlerRoom}
        kid={kids[1]}
        isParentHere={parentPosition === 'toddlerRoom'}
        activeActivity={
          activeKidIndex === 1 && activeActivityIndex !== null
            ? kids[1].activities[activeActivityIndex]
            : undefined
        }
        onRoomClick={() => onRoomClick('toddlerRoom')}
      />
      <Room
        {...rooms.parentRoom}
        isParentHere={parentPosition === 'parentRoom'}
        onRoomClick={() => onRoomClick('parentRoom')}
      />
    </div>
  );
};

export default House; 