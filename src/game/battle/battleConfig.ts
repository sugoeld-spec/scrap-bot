import type { FighterStats } from './types';

export const STAGE_NUMBER = 1;

export const PLAYER_STATS: FighterStats = {
  maxHp: 120,
  attack: 18,
  attackIntervalMs: 1_150,
};

export const ENEMY_STATS: FighterStats = {
  maxHp: 105,
  attack: 14,
  attackIntervalMs: 1_350,
};
