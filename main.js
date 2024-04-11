import './style.css'
import Phaser from "phaser";

const size = {
  width: 1000,
  height: 700,
};

const gravity = 100

const ASSET_KEYS = {
  BACKGROUND: "background",
  PLAYER: {
    IDLE: "player_idle",
    RUN: "player_run",
    JUMP: "player_jump"
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super("game-scene");
  }

  // prelaod assets here
  preload() {
    this.load.image(ASSET_KEYS.BACKGROUND, "/assets/background.png")
    this.load.image(ASSET_KEYS.PLAYER.JUMP, "/assets/player/jump.png")
  }

  // handle the preloaded assets here
  create() {
    this.add.tileSprite(0, 0, config.width, config.height, ASSET_KEYS.BACKGROUND)
    this.add.image(0, 0, ASSET_KEYS.PLAYER.JUMP)
    // this.add.image(0, 0, ASSET_KEYS.BACKGROUND)
    // this.add.text(
    //   size.width / 2 - 70, 
    //   size.height / 2, 
    //   "Hello, World!"
    // );
  }
    
    // runs on every frame
    update() { }
}

const config = {
  type: Phaser.WEBGL,
  width: size.width,
  height: size.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: gravity },
      debug: true
    },
  },
  scene: [GameScene],
};
  
const game = new Phaser.Game(config);