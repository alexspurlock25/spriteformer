import './style.css'
import Phaser from "phaser";

const size = {
  width: 1000,
  height: 700,
};

const gravity = 100

const ASSET_KEYS = {
  BACKGROUND: "background",
  PLATFORMS: "platforms",
  PLAYER: {
    FALL: "player_fall",
    HIT: "player_hit",
    IDLE: "player_idle",
    JUMP: "player_jump",
    RUN: "player_run"
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
    
    // player
    this.load.image(ASSET_KEYS.PLAYER.FALL, "/assets/player/fall.png")
    this.load.spritesheet(ASSET_KEYS.PLAYER.HIT, "/assets/player/hit.png", { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet(ASSET_KEYS.PLAYER.IDLE, "/assets/player/idle.png", { frameWidth: 32, frameHeight: 32 })
    this.load.image(ASSET_KEYS.PLAYER.JUMP, "/assets/player/jump.png")
    this.load.spritesheet(ASSET_KEYS.PLAYER.RUN, "/assets/player/run.png", { frameWidth: 32, frameHeight: 32 })

    this.load.spritesheet(ASSET_KEYS.PLATFORMS, "/assets/terrain.png", { frameWidth: 48, frameHeight: 48 })
  }

  // handle the preloaded assets here
  create() {
    this.add.tileSprite(0, 0, config.width, config.height, ASSET_KEYS.BACKGROUND)
      .setOrigin(0, 0)

    this.createLevel()
    this.createPlayer()
  }
    
    // runs on every frame
    update() { }

    createPlayer() {
      this.anims.create({
        key: "idle",
        frameRate: 24,
        frames: this.anims.generateFrameNumbers(ASSET_KEYS.PLAYER.IDLE, { start: 0, end: 10 }),
        repeat: -1
      });
    
      this.player = this.add.sprite(24, config.height - 90, ASSET_KEYS.PLAYER.IDLE)
      this.player.anims.play("idle")
    }

    createLevel() {
      for (let i = 24; i < config.width; i = i + 90) {
        this.add.image(i, config.height - 50, ASSET_KEYS.PLATFORMS, 2)        
      }
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
      gravity: { y: gravity },
      debug: true
    },
  },
  scene: [GameScene],
};
  
const game = new Phaser.Game(config);