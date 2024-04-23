import './style.css'

import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene'

export const size = {
  width: 1000,
  height: 700,
};

export const gravity = 400

export const ASSET_KEYS = {
  BACKGROUND: "background",
  PLATFORMS: "platforms",
  STRAWBERRY: "strawberry",
  FLAG: "flag",
  PLAYER: {
    FALL: "player_fall",
    HIT: "player_hit",
    IDLE: "player_idle",
    JUMP: "player_jump",
    RUN: "player_run"
  }
}

export const config = {
  type: Phaser.WEBGL,
  width: size.width,
  height: size.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: gravity },
      debug: false
    },
  },
  scene: [MenuScene, GameScene],
};
  
const game = new Phaser.Game(config);