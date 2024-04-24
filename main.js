import './style.css'

import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene'

export const size = {
  width: 1000,
  height: 700,
};

export const ASSET_KEYS = {
  NORMAL_BACKGROUND: "background",
  GLUMMY_BACKGROUND: "glummy_background",
  MENU_BACKGROUND: "menu_background",
  PLATFORMS: "platforms",
  FONT: "game_font",
  STRAWBERRY: "strawberry",
  FLAG: "flag",
  PLAYER: {
    FALL: "player_fall",
    HIT: "player_hit",
    IDLE: "player_idle",
    JUMP: "player_jump",
    RUN: "player_run"
  },
  SOUND: {
    MENU: "menu_background_sound",
    GAME: "game_background_sound",
    BUTTON_PRESS: "button_press_sound"
  }
}

const config = {
  type: Phaser.WEBGL,
  width: size.width,
  height: size.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 400 },
      debug: false
    },
  },
  scene: [MenuScene, GameScene],
};
  
const game = new Phaser.Game(config);