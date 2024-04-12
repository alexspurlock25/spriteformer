import './style.css'
import Phaser from "phaser";

const size = {
  width: 1000,
  height: 700,
};

const gravity = 400
const playerSpeed = 200
let isOnGround = true

const ASSET_KEYS = {
  BACKGROUND: "background",
  PLATFORMS: "platforms",
  STRAWBERRY: "strawberry",
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
    
    // player
    this.load.spritesheet(ASSET_KEYS.PLAYER.FALL, "/assets/player/fall.png", { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet(ASSET_KEYS.PLAYER.HIT, "/assets/player/hit.png", { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet(ASSET_KEYS.PLAYER.IDLE, "/assets/player/idle.png", { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet(ASSET_KEYS.PLAYER.JUMP, "/assets/player/jump.png", { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet(ASSET_KEYS.PLAYER.RUN, "/assets/player/run.png", { frameWidth: 32, frameHeight: 32 })

    this.load.spritesheet(ASSET_KEYS.PLATFORMS, "/assets/terrain.png", { frameWidth: 48, frameHeight: 48 })

    this.load.spritesheet(ASSET_KEYS.STRAWBERRY, "/assets/items/strawberry.png", { frameWidth: 32, frameHeight: 32 })
  }

  // handle the preloaded assets here
  create() {
    this.platformGroup = this.add.group()
    this.fruitGroup = this.add.group()

    this.add.tileSprite(0, 0, config.width, config.height, ASSET_KEYS.BACKGROUND)
      .setOrigin(0, 0)

    this.createLevel()
    this.createPlayer()

    this.physics.add.collider(this.player, this.platformGroup, () => { isOnGround = true })

  }
    
  // runs on every frame
  update() {
    if (this.cursor.left.isDown) {
      this.player.setVelocityX(-playerSpeed).anims.play("run", true);
      this.player.scaleX = -1
      this.player.setOffset(30, 0);
    } else if (this.cursor.right.isDown) {
      this.player.setVelocityX(playerSpeed).anims.play("run", true);
      this.player.scaleX = 1
      this.player.setOffset(0, 0);
    } else {
      this.player.setVelocityX(0).anims.play("idle", true);
    }

    if (this.cursor.space.isDown && isOnGround == true) {
      this.player.setVelocityY(-playerSpeed).anims.play("jump", true);
      isOnGround = false
    } 
  }

  createPlayer() {
    this.cursor = this.input.keyboard.createCursorKeys()

    this.anims.create({
      key: "idle",
      frameRate: 24,
      frames: this.anims.generateFrameNumbers(ASSET_KEYS.PLAYER.IDLE, { start: 0, end: 10 }),
      repeat: -1
    });

    this.anims.create({
      key: "run",
      frameRate: 24,
      frames: this.anims.generateFrameNumbers(ASSET_KEYS.PLAYER.RUN, { start: 0, end: 11 }),
      repeat: -1
    });

    this.anims.create({
      key: "jump",
      frameRate: 24,
      frames: this.anims.generateFrameNumbers(ASSET_KEYS.PLAYER.JUMP, { start: 0, end: 0 }),
      repeat: -1
    });
  
    this.player = this.physics.add.sprite(24, config.height - 120, ASSET_KEYS.PLAYER.IDLE)
    // this.player.setCollideWorldBounds(true)
    this.player.addCollidesWith(1)
    this.player.anims.play("idle")
  }

  createLevel() {
    for (let i = 24; i < config.width; i = i + 150) {
      let platform = this.physics.add.sprite(i, config.height - 60, ASSET_KEYS.PLATFORMS, 2).setImmovable(true)
      platform.body.setCollisionCategory(1)
      platform.body.setAllowGravity(false);

      this.platformGroup.add(platform, true)
    }

    this.anims.create({
      key: "spin",
      frameRate: 24,
      frames: this.anims.generateFrameNumbers(ASSET_KEYS.STRAWBERRY, { start: 0, end: 16 }),
      repeat: -1
    });

    this.platformGroup.children.each(platform => {
      let strawberry = this.physics.add.sprite(platform.body.position.x + (platform.body.width * .5), config.height - 100, ASSET_KEYS.STRAWBERRY).setImmovable(true)
      strawberry.body.setCollisionCategory(2)
      strawberry.body.setAllowGravity(false);
      strawberry.anims.play("spin")
    })
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