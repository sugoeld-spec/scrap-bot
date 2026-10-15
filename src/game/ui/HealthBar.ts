import Phaser from 'phaser';

export class HealthBar {
  private readonly fill: Phaser.GameObjects.Rectangle;
  private readonly valueText: Phaser.GameObjects.Text;
  private readonly width: number;
  private readonly maxHp: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    maxHp: number,
    label: string,
    color: number,
    align: 'left' | 'right',
  ) {
    this.width = width;
    this.maxHp = maxHp;
    const originX = align === 'left' ? 0 : 1;
    const edgeX = align === 'left' ? x : x + width;

    scene.add.text(edgeX, y - 24, label, {
      fontFamily: 'monospace', fontSize: '13px', color: '#93a2b0', fontStyle: 'bold',
    }).setOrigin(originX, 0.5);
    scene.add.rectangle(x + width / 2, y, width, 14, 0x151c25).setStrokeStyle(1, 0x334150);
    this.fill = scene.add.rectangle(x, y, width, 10, color).setOrigin(0, 0.5);
    this.valueText = scene.add.text(edgeX, y + 22, `${maxHp} / ${maxHp}`, {
      fontFamily: 'monospace', fontSize: '11px', color: '#d9e1e8',
    }).setOrigin(originX, 0.5);
  }

  setHp(hp: number): void {
    const safeHp = Phaser.Math.Clamp(hp, 0, this.maxHp);
    this.fill.displayWidth = this.width * (safeHp / this.maxHp);
    this.valueText.setText(`${safeHp} / ${this.maxHp}`);
  }
}
