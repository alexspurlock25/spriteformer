import Phaser from "phaser";
import { ASSET_KEYS, size } from "../main";
import { getWeatherCode } from "../weatherapi";

const playerSpeed = 250
let isOnGround = true

export class GameScene extends Phaser.Scene {

	constructor() {
		super("GameScene");
    this.playerScoreText;
    this.playerScore = 0;
    this.weatherCode = 0;
    this.background;
    this.platformIndex = 2;
	}

  preload() {
    this.load.image(ASSET_KEYS.NORMAL_BACKGROUND, "./assets/background.png")
    this.load.image(ASSET_KEYS.GLUMMY_BACKGROUND, "./assets/glummy.png")

    // player
    this.load.spritesheet(ASSET_KEYS.PLAYER.FALL, "./assets/player/fall.png", { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet(ASSET_KEYS.PLAYER.HIT, "./assets/player/hit.png", { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet(ASSET_KEYS.PLAYER.IDLE, "./assets/player/idle.png", { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet(ASSET_KEYS.PLAYER.JUMP, "./assets/player/jump.png", { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet(ASSET_KEYS.PLAYER.RUN, "./assets/player/run.png", { frameWidth: 32, frameHeight: 32 })

    this.load.spritesheet(ASSET_KEYS.PLATFORMS, "./assets/terrain.png", { frameWidth: 48, frameHeight: 48 })

    this.load.spritesheet(ASSET_KEYS.STRAWBERRY, "./assets/Items/strawberry.png", { frameWidth: 32, frameHeight: 32 })

    this.load.spritesheet(ASSET_KEYS.FLAG, "./assets/Items/flag.png", { frameWidth: 64, frameHeight: 64 })

    //music & audio
    this.load.audio(ASSET_KEYS.SOUND.GAME, "./assets/Audio/backgroundgame.mp3");
    this.load.audio("death_sound", "./assets/Audio/Death_Sound.mp3");
    this.load.audio("jump_sound", "./assets/Audio/Jumping.mp3");

    //unused sound effects
    this.load.audio("flag_sound", "./assets/Audio/level_win.mp3");
    this.load.audio("pickup_sound", "./assets/Audio/pickup.mp3");
    this.load.audio("rickRoll", "./assets/Audio/rickRoll.mp3");
  }  

  create() {
    getWeatherCode().then(response => this.weatherCode = response)
    this.platformGroup = this.add.group()
    this.fruitGroup = this.add.group()

    if (this.weatherCode >= 50 || this.weatherCode < 100) {
      this.background = this.add.tileSprite(0, 0, size.width, size.height, ASSET_KEYS.GLUMMY_BACKGROUND)
      .setOrigin(0, 0)
      this.platformIndex = 0
    } else {
      this.background = this.add.tileSprite(0, 0, size.width, size.height, ASSET_KEYS.NORMAL_BACKGROUND)
      .setOrigin(0, 0)
      this.platformIndex = 0
    }

    this.createMusic()
    this.createPlayer()
    this.createLevel()

    this.physics.add.collider(this.player, this.platformGroup, () => { isOnGround = true })

    this.playerScoreText = this.add.text(40, 40, `Score: ${this.playerScore}`);
	}
  
  update() {
    //Moves backgrounds
    this.background.tilePositionX -= -0.15;

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
  
    this.player = this.physics.add.sprite(24, size.height - 120, ASSET_KEYS.PLAYER.IDLE)
    // this.player.setCollideWorldBounds(true)
    this.player.addCollidesWith(1)
    this.player.anims.play("idle")
  }

  createLevel() {
    this.anims.create({
      key: "spin",
      frameRate: 24,
      frames: this.anims.generateFrameNumbers(ASSET_KEYS.STRAWBERRY, { start: 0, end: 16 }),
      repeat: -1
    });

    this.anims.create({
      key: "wave",
      frameRate: 24,
      frames: this.anims.generateFrameNumbers(ASSET_KEYS.FLAG, { start: 0, end: 9 }),
      repeat: -1
    });

    let first = this.physics.add.sprite(24, size.height - 60, ASSET_KEYS.PLATFORMS, this.platformIndex).setImmovable(true)
    first.body.setAllowGravity(false);
    this.platformGroup.add(first, true)

    this.flag = this.physics.add.sprite(size.width - 24, size.height - 116, ASSET_KEYS.FLAG)
    this.flag.body.setAllowGravity(false)
    this.flag.anims.play("wave")

    const numPlatforms = 6;
    const intervalX = (size.width - 100) / numPlatforms + 1

    for (let i = 1; i <= numPlatforms; i++) {
      let randomY = this.getRandomInt(size.height - 100, size.height)
      let randomX = intervalX * i;
      let platform = this.physics.add.sprite(randomX, randomY, ASSET_KEYS.PLATFORMS, this.platformIndex).setImmovable(true)
      platform.body.setAllowGravity(false);
      this.platformGroup.add(platform, true)
    }

    let last = this.physics.add.sprite(size.width - 24, size.height - 60, ASSET_KEYS.PLATFORMS, this.platformIndex).setImmovable(true)
    last.body.setAllowGravity(false);
    this.platformGroup.add(last, true)

    this.platformGroup.children.each((platform, index) => {
      if (index != 0 || index != this.platformGroup.children.getArray().length - 1) {
        let strawberry = this.physics.add.sprite(platform.body.position.x + (platform.body.width * .5), platform.body.position.y - 30, ASSET_KEYS.STRAWBERRY).setImmovable(true)
        strawberry.body.setAllowGravity(false);
        strawberry.anims.play("spin")
        this.fruitGroup.add(strawberry, true)
      }
    })

    this.physics.add.overlap(
      this.player,
      this.fruitGroup,
      this.fruitHit,
      null,
      this 
    );

    this.physics.add.overlap(
      this.player,
      this.flag,
      this.gameWon,
      null,
      this 
    );
  }

  getRandomInt(min, max) { 
    min = Math.ceil(min); 
    max = Math.floor(max); 
    return Math.floor(Math.random() * (max - min + 1)) + min; 
  }

  gameWon(player, flag) {
    this.scene.start("PlayAgainScene");
    this.scene.stop("GameScene")
  }

  fruitHit(player, fruit) {
    this.pickupsound.play()
    this.fruitGroup.remove(fruit, true, true)
    // this.target.setX(this.getRandomX());
    this.playerScore++;
    this.playerScoreText.setText(`Score: ${this.playerScore}`);
  }

  createMusic() {
    //music config
    this.music = this.sound.add(ASSET_KEYS.SOUND.GAME);

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
    this.rickRoll = this.sound.add("rickRoll", {volume: 0.5});
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