export const ACTIVITY_DURATIONS = {
  SHORT: 1, // 1 second
  MEDIUM: 2, // 2 seconds
  LONG: 3, // 3 seconds
} as const;

export const CYCLE_LENGTH = 30; // Total game cycle is 30 seconds (0.5 minute)
export const TARGET_SLEEP_TIME = 20; // Target sleep time is 20 seconds

export type KidActivity = {
  name: string;
  duration: number;
  isInProgress: boolean;
  cooldown: number;
  lastCompletedAt: number | null;
};

export type Kid = {
  name: string;
  isAsleep: boolean;
  activities: KidActivity[];
};

export type GameState = {
  timeElapsed: number;
  cycleTime: number;
  parentSleepTime: number;
  targetSleepTime: number;
  isParentSleeping: boolean;
  kids: Kid[];
}; 