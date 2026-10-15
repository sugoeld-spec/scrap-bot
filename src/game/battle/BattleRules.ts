import type { BattleResult, DamageResult, FighterId, FighterState, FighterStats } from './types';

const makeFighter = (id: FighterId, stats: FighterStats): FighterState => ({
  id,
  ...stats,
  hp: stats.maxHp,
});

export class BattleRules {
  readonly player: FighterState;
  readonly enemy: FighterState;
  result: BattleResult = 'playing';

  constructor(playerStats: FighterStats, enemyStats: FighterStats) {
    this.player = makeFighter('player', playerStats);
    this.enemy = makeFighter('enemy', enemyStats);
  }

  attack(attackerId: FighterId): DamageResult | null {
    if (this.result !== 'playing') return null;

    const attacker = this.getFighter(attackerId);
    const target = this.getFighter(attackerId === 'player' ? 'enemy' : 'player');
    const damage = Math.max(0, attacker.attack);
    target.hp = Math.max(0, target.hp - damage);

    if (target.hp === 0) {
      this.result = target.id === 'enemy' ? 'victory' : 'defeat';
    }

    return {
      attackerId,
      targetId: target.id,
      damage,
      targetHp: target.hp,
      result: this.result,
    };
  }

  getFighter(id: FighterId): FighterState {
    return id === 'player' ? this.player : this.enemy;
  }
}
