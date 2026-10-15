export type FighterId = 'player' | 'enemy';

export interface FighterStats {
  maxHp: number;
  attack: number;
  attackIntervalMs: number;
}

export interface FighterState extends FighterStats {
  id: FighterId;
  hp: number;
}

export type BattleResult = 'playing' | 'victory' | 'defeat';

export interface DamageResult {
  attackerId: FighterId;
  targetId: FighterId;
  damage: number;
  targetHp: number;
  result: BattleResult;
}
