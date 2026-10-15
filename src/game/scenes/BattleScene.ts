import Phaser from 'phaser';
import { BattleRules } from '../battle/BattleRules';
import { ENEMY_STATS, PLAYER_STATS, STAGE_NUMBER } from '../battle/battleConfig';
import type { FighterId } from '../battle/types';
import { RobotView } from '../rendering/RobotView';
import { HealthBar } from '../ui/HealthBar';

const WIDTH = 430;
const HEIGHT = 760;

export class BattleScene extends Phaser.Scene {
  private battle!: BattleRules;
  private robots!: Record<FighterId, RobotView>;
  private healthBars!: Record<FighterId, HealthBar>;
  private attackTimers: Phaser.Time.TimerEvent[] = [];
  private ended = false;

  constructor() {
    super('BattleScene');
  }

  create(): void {
    this.battle = new BattleRules(PLAYER_STATS, ENEMY_STATS);
    this.ended = false;
    this.drawArena();
    this.createHud();

    this.robots = {
      player: new RobotView(this, 118, 420, 'player'),
      enemy: new RobotView(this, 312, 420, 'enemy'),
    };

    this.add.text(WIDTH / 2, 535, 'AUTO BATTLE', {
      fontFamily: 'monospace', fontSize: '12px', color: '#526274', letterSpacing: 3,
    }).setOrigin(0.5);

    this.time.delayedCall(650, () => this.startBattle());
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.stopBattle());
  }

  private drawArena(): void {
    this.cameras.main.setBackgroundColor('#0a0d14');
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x1e2a35, 0.68);
    for (let x = 0; x <= WIDTH; x += 43) graphics.lineBetween(x, 170, x, 620);
    for (let y = 190; y <= 620; y += 43) graphics.lineBetween(0, y, WIDTH, y);
    graphics.fillStyle(0x0e141d, 0.95).fillRect(0, 585, WIDTH, 175);
    graphics.lineStyle(2, 0x273745, 0.85).lineBetween(0, 585, WIDTH, 585);

    this.add.text(22, 24, 'SCRAP', {
      fontFamily: 'monospace', fontSize: '28px', color: '#f2f5f7', fontStyle: 'bold',
    });
    this.add.text(126, 24, 'BOT', {
      fontFamily: 'monospace', fontSize: '28px', color: '#43d8ff', fontStyle: 'bold',
    });
    this.add.text(24, 61, 'COMBAT SYSTEM / PROTOTYPE 01', {
      fontFamily: 'monospace', fontSize: '10px', color: '#526274', letterSpacing: 1,
    });
  }

  private createHud(): void {
    this.add.rectangle(WIDTH / 2, 127, 82, 34, 0x141c25).setStrokeStyle(1, 0x405166);
    this.add.text(WIDTH / 2, 127, `STAGE ${STAGE_NUMBER}`, {
      fontFamily: 'monospace', fontSize: '13px', color: '#f1c75b', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.healthBars = {
      player: new HealthBar(this, 24, 126, 150, PLAYER_STATS.maxHp, 'UNIT 01', 0x43d8ff, 'left'),
      enemy: new HealthBar(this, 256, 126, 150, ENEMY_STATS.maxHp, 'HOSTILE', 0xff6b5e, 'right'),
    };
  }

  private startBattle(): void {
    if (this.ended) return;
    this.scheduleAttack('player');
    this.scheduleAttack('enemy');
  }

  private scheduleAttack(id: FighterId): void {
    const interval = this.battle.getFighter(id).attackIntervalMs;
    const timer = this.time.addEvent({
      delay: interval,
      loop: true,
      callback: () => this.launchAttack(id),
    });
    this.attackTimers.push(timer);
  }

  private launchAttack(attackerId: FighterId): void {
    if (this.ended || this.battle.result !== 'playing') return;
    const targetId: FighterId = attackerId === 'player' ? 'enemy' : 'player';
    const attacker = this.robots[attackerId];
    const target = this.robots[targetId];
    const start = attacker.getMuzzlePosition();
    const color = attackerId === 'player' ? 0x64e2ff : 0xff846f;
    const projectile = this.add.circle(start.x, start.y, 7, color).setDepth(20);
    const glow = this.add.circle(start.x, start.y, 14, color, 0.18).setDepth(19);
    attacker.playAttack();

    this.tweens.add({
      targets: [projectile, glow],
      x: target.x,
      y: target.y - 5,
      duration: 260,
      ease: 'Quad.in',
      onComplete: () => {
        projectile.destroy();
        glow.destroy();
        this.resolveHit(attackerId);
      },
    });
  }

  private resolveHit(attackerId: FighterId): void {
    if (this.ended) return;
    const outcome = this.battle.attack(attackerId);
    if (!outcome) return;

    this.healthBars[outcome.targetId].setHp(outcome.targetHp);
    this.robots[outcome.targetId].playHit();
    this.showDamage(this.robots[outcome.targetId], outcome.damage);

    if (outcome.result !== 'playing') this.finishBattle(outcome.result === 'victory');
  }

  private showDamage(target: RobotView, damage: number): void {
    const text = this.add.text(target.x, target.y - 126, `-${damage}`, {
      fontFamily: 'monospace', fontSize: '22px', color: '#ffffff', fontStyle: 'bold',
      stroke: '#0a0d14', strokeThickness: 5,
    }).setOrigin(0.5).setDepth(30);
    this.tweens.add({
      targets: text, y: text.y - 35, alpha: 0, duration: 520, ease: 'Cubic.out',
      onComplete: () => text.destroy(),
    });
  }

  private finishBattle(victory: boolean): void {
    if (this.ended) return;
    this.ended = true;
    this.stopBattle();
    this.tweens.killTweensOf([this.robots.player, this.robots.enemy]);

    const overlay = this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x05070b, 0.78)
      .setDepth(50).setInteractive();
    const panel = this.add.rectangle(WIDTH / 2, 385, 330, 230, 0x111821, 0.98)
      .setStrokeStyle(2, victory ? 0x43d8ff : 0xff6b5e).setDepth(51);
    const result = this.add.text(WIDTH / 2, 326, victory ? 'VICTORY' : 'DEFEAT', {
      fontFamily: 'monospace', fontSize: '34px', color: victory ? '#64e2ff' : '#ff846f', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(52);
    const subtitle = this.add.text(WIDTH / 2, 369, victory ? '적 유닛을 파괴했습니다' : '전투 시스템이 정지했습니다', {
      fontFamily: 'sans-serif', fontSize: '14px', color: '#aab5bf',
    }).setOrigin(0.5).setDepth(52);
    const button = this.add.rectangle(WIDTH / 2, 433, 210, 52, victory ? 0x43d8ff : 0xff6b5e)
      .setDepth(52).setInteractive({ useHandCursor: true });
    const buttonText = this.add.text(WIDTH / 2, 433, '다시 시작', {
      fontFamily: 'sans-serif', fontSize: '17px', color: '#081017', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(53);

    button.on('pointerover', () => button.setAlpha(0.82));
    button.on('pointerout', () => button.setAlpha(1));
    button.on('pointerdown', () => this.scene.restart());
    this.tweens.add({ targets: [panel, result, subtitle, button, buttonText], alpha: { from: 0, to: 1 }, duration: 260 });
    void overlay;
  }

  private stopBattle(): void {
    this.attackTimers.forEach((timer) => timer.remove(false));
    this.attackTimers = [];
  }
}
