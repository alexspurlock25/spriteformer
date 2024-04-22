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




class MenuScene extends Phaser.Scene {
  constructor() {
    super("menu-scene");
  }
  preload() {
    this.load.image("background", "/public/assets/background.png")
    this.load.image("background2", "/public/assets/background2.png")
    this.load.bitmapFont("titleFont", "/public/assets/bitmaps/Unnamed.png", "/public/assets/bitmaps/Unnamed.xml")

    //music & audio
    this.load.audio("button1", "/public/assets/Audio/button_press.mp3");
    //this.load.audio("background_music", "/public/assets/Audio/backgroundgame.mp3");
    this.load.audio("background_music2", "/public/assets/Audio/backgroundgame2.mp3");
  }

  create() {
    //Deal Background for Main Menu
    this.background = this.add.tileSprite(0, 0, config.width, config.height, "background")
    .setOrigin(0, 0)
    this.background2 = this.add.tileSprite(0, 0, config.width, config.height, "background2")
    .setOrigin(0, 0)
   
    //"Spriteformer" title
    this.text1 = this.add.bitmapText(130, 100, "titleFont", "Spriteformer", 100);
    this.onStart();

    //Button to Change Scene to First Level
    const startButton = this.add.bitmapText(420, 400, "titleFont", "Play", 60);
    startButton.setInteractive();
    startButton.on('pointerdown', function (pointer) {this.scene.start('game-scene'); this.buttonSound.play(); this.music.stop(musicConfig);}, this);
    


    //audio
    this.buttonSound = this.sound.add("button1", {volume: 0.5});

    this.music = this.sound.add("background_music2");

    var musicConfig = {
      mute: false,
      volume: .25,
      rate: .75,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    }

    this.music.play(musicConfig);
  }

  update() {
    //Moves backgrounds
    this.background.tilePositionX -= -0.15;
    this.background2.tilePositionX -= -0.25;
    
  }


  onStart() {
    //Makes "Spriteformer" Flash
    var tween = this.tweens.add({
      targets: this.text1,
      alpha: 0.5,
      ease: 'Power1',
      duration: 2000,
      repeat: -1,
      yoyo: true
    });
  }

}


class GameScene extends Phaser.Scene {
  constructor() {
    super("game-scene");
  }

  // prelaod assets here
  preload() {
    this.load.image(ASSET_KEYS.BACKGROUND, "/public/assets/background.png")
    
    // player
    this.load.spritesheet(ASSET_KEYS.PLAYER.FALL, "/public/assets/player/fall.png", { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet(ASSET_KEYS.PLAYER.HIT, "/public/assets/player/hit.png", { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet(ASSET_KEYS.PLAYER.IDLE, "/public/assets/player/idle.png", { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet(ASSET_KEYS.PLAYER.JUMP, "/public/assets/player/jump.png", { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet(ASSET_KEYS.PLAYER.RUN, "/public/assets/player/run.png", { frameWidth: 32, frameHeight: 32 })

    this.load.spritesheet(ASSET_KEYS.PLATFORMS, "/public/assets/terrain.png", { frameWidth: 48, frameHeight: 48 })

    this.load.spritesheet(ASSET_KEYS.STRAWBERRY, "/public/assets/items/strawberry.png", { frameWidth: 32, frameHeight: 32 })

    //music & audio
    this.load.audio("background_music", "/public/assets/Audio/backgroundgame.mp3");
    this.load.audio("death_sound", "/public/assets/Audio/Death_Sound.mp3");
    this.load.audio("jump_sound", "/public/assets/Audio/Jumping.mp3");

    //unused sound effects
    this.load.audio("flag_sound", "/public/assets/Audio/level_win.mp3");
    this.load.audio("pickup_sound", "/public/assets/Audio/pickup.mp3");
    

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

    //music config
    this.music = this.sound.add("background_music");

    var musicConfig = {
      mute: false,
      volume: .25,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    }

    this.music.play(musicConfig);

    //audio config
    this.deathsound = this.sound.add("death_sound", {volume: 0.5});
    this.jumpsound = this.sound.add("jump_sound", {volume: 0.5});

    //unused audio config
    this.flagsound = this.sound.add("flag_sound", {volume: 0.5});
    this.pickupsound = this.sound.add("pickup_sound", {volume: 0.5});

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
      this.jumpsound.play();
      isOnGround = false
    } 


    //Check to see is player is in void
    if(this.player.y > 720)
      {this.deadPlayer(this.player);}
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



  deadPlayer(player) {
    //sound effect   
    this.deathsound.play();
    
    //reset the player
    this.resetPlayerPos(player);
    
    //tween to make player flash
    this.player.alpha = 1
    var tween = this.tweens.add({
      targets: this.player,
      alpha: 0.5,
      ease: 'Power1',
      duration: 200,
      repeat: 4,
      yoyo: true
    });

    
  }
  
  resetPlayerPos(player) {
    player.y = 580;
    player.x = 24;
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
  scene: [MenuScene, GameScene],
};
  
const game = new Phaser.Game(config);