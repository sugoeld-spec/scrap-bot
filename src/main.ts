import Phaser from 'phaser';
import './styles.css';
import { BattleScene } from './game/scenes/BattleScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  width: 430,
  height: 760,
  backgroundColor: '#0a0d14',
  scene: [BattleScene],
  render: {
    antialias: true,
    pixelArt: false,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

new Phaser.Game(config);
