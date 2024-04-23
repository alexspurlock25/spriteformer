import Phaser from "phaser";
import { config, ASSET_KEYS } from "../main";

export class MenuScene extends Phaser.Scene {
	constructor() {
		super("MenuScene");
	}
  
  preload() {
    this.load.image(ASSET_KEYS.NORMAL_BACKGROUND, "./assets/background.png")
    this.load.image("background2", "./assets/background2.png")
    this.load.bitmapFont("titleFont", "./assets/bitmaps/Unnamed.png", "./assets/bitmaps/Unnamed.xml")

    //music & audio
    this.load.audio("button1", "./assets/Audio/button_press.mp3");
    this.load.audio("background_music2", "./assets/Audio/backgroundgame2.mp3");
  }

  create() {
    //Deal Background for Main Menu
    this.background = this.add.tileSprite(0, 0, config.width, config.height, ASSET_KEYS.NORMAL_BACKGROUND)
    .setOrigin(0, 0)
    console.log(this.background)
    this.background2 = this.add.tileSprite(0, 0, config.width, config.height, "background2")
    .setOrigin(0, 0)
   
    //"Spriteformer" title
    this.text1 = this.add.bitmapText(130, 100, "titleFont", "Spriteformer", 100);
    this.onStart();

    //Button to Change Scene to First Level
    const startButton = this.add.bitmapText(420, 400, "titleFont", "Play", 60);
    startButton.setInteractive();
    startButton.on('pointerdown', function (pointer) {this.scene.start('GameScene'); this.buttonSound.play(); this.music.stop(musicConfig);}, this);

    //music & audio
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