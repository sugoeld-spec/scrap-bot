import Phaser from 'phaser';
import type { FighterId } from '../battle/types';

export class RobotView extends Phaser.GameObjects.Container {
  readonly id: FighterId;
  private readonly bodyParts: Phaser.GameObjects.Shape[] = [];
  private readonly baseX: number;

  constructor(scene: Phaser.Scene, x: number, y: number, id: FighterId) {
    super(scene, x, y);
    this.id = id;
    this.baseX = x;
    const primary = id === 'player' ? 0x43d8ff : 0xff6b5e;
    const dark = id === 'player' ? 0x123b4b : 0x4a1e1c;
    const facing = id === 'player' ? 1 : -1;

    const shadow = scene.add.ellipse(0, 57, 112, 20, 0x000000, 0.35);
    const legA = scene.add.rectangle(-25, 38, 22, 36, dark).setStrokeStyle(2, primary);
    const legB = scene.add.rectangle(25, 38, 22, 36, dark).setStrokeStyle(2, primary);
    const body = scene.add.rectangle(0, -4, 88, 74, dark).setStrokeStyle(3, primary);
    const head = scene.add.rectangle(0, -65, 70, 45, 0x202b35).setStrokeStyle(3, primary);
    const antenna = scene.add.rectangle(0, -97, 4, 18, primary);
    const antennaTip = scene.add.circle(0, -108, 6, primary);
    const eyeA = scene.add.rectangle(-17, -66, 10, 7, primary);
    const eyeB = scene.add.rectangle(17, -66, 10, 7, primary);
    const shoulder = scene.add.circle(51 * facing, -5, 17, dark).setStrokeStyle(3, primary);
    const cannon = scene.add.rectangle(73 * facing, -5, 42, 18, 0x202b35).setStrokeStyle(2, primary);
    const core = scene.add.circle(0, -4, 15, primary, 0.22).setStrokeStyle(2, primary);
    const coreDot = scene.add.circle(0, -4, 5, primary);
    const footA = scene.add.rectangle(-28, 59, 34, 10, 0x202b35);
    const footB = scene.add.rectangle(28, 59, 34, 10, 0x202b35);

    this.bodyParts.push(legA, legB, body, head, antenna, antennaTip, eyeA, eyeB, shoulder, cannon, core, coreDot, footA, footB);
    this.add([shadow, ...this.bodyParts]);
    scene.add.existing(this);

    scene.tweens.add({ targets: core, alpha: 0.65, duration: 700, yoyo: true, repeat: -1 });
    scene.tweens.add({ targets: this, y: y - 4, duration: 1150, ease: 'Sine.inOut', yoyo: true, repeat: -1 });
  }

  getMuzzlePosition(): Phaser.Math.Vector2 {
    const direction = this.id === 'player' ? 1 : -1;
    return new Phaser.Math.Vector2(this.x + 98 * direction, this.y - 5);
  }

  playAttack(): void {
    const direction = this.id === 'player' ? -1 : 1;
    this.scene.tweens.add({
      targets: this,
      x: this.baseX + 9 * direction,
      duration: 70,
      yoyo: true,
      ease: 'Quad.out',
    });
  }

  playHit(): void {
    this.bodyParts.forEach((part) => part.setAlpha(0.18));
    this.scene.time.delayedCall(90, () => this.bodyParts.forEach((part) => part.setAlpha(1)));
    this.scene.cameras.main.shake(90, 0.004);
  }
}
