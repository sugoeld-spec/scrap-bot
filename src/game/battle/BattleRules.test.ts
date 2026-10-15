import { describe, expect, it } from 'vitest';
import { BattleRules } from './BattleRules';

const stats = { maxHp: 20, attack: 7, attackIntervalMs: 1_000 };

describe('BattleRules', () => {
  it('피해를 적용하고 HP를 0 아래로 내리지 않는다', () => {
    const battle = new BattleRules(stats, { ...stats, maxHp: 5 });
    const hit = battle.attack('player');
    expect(hit?.targetHp).toBe(0);
    expect(battle.enemy.hp).toBe(0);
    expect(battle.result).toBe('victory');
  });

  it('전투 종료 후 추가 공격을 무시한다', () => {
    const battle = new BattleRules(stats, { ...stats, maxHp: 5 });
    battle.attack('player');
    expect(battle.attack('enemy')).toBeNull();
    expect(battle.player.hp).toBe(20);
  });

  it('플레이어 HP가 0이면 패배한다', () => {
    const battle = new BattleRules({ ...stats, maxHp: 5 }, stats);
    const hit = battle.attack('enemy');
    expect(hit?.result).toBe('defeat');
  });
});
