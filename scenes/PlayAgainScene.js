import Phaser from "phaser";
import { ASSET_KEYS, size } from "../main";

export class PlayAgainScene extends Phaser.Scene {
	constructor() {
		super("PlayAgainScene");
	}
  
  preload() {
    this.load.image(ASSET_KEYS.NORMAL_BACKGROUND, "./assets/background.png")
    this.load.image(ASSET_KEYS.MENU_BACKGROUND, "./assets/background2.png")
    this.load.bitmapFont(ASSET_KEYS.FONT, "./assets/bitmaps/Unnamed.png", "./assets/bitmaps/Unnamed.xml")

    //music & audio
    this.load.audio(ASSET_KEYS.SOUND.BUTTON_PRESS, "./assets/Audio/button_press.mp3");
    this.load.audio(ASSET_KEYS.SOUND.MENU, "./assets/Audio/backgroundgame2.mp3");
  }

  create() {
    //Deal Background for Main Menu
    this.background = this.add.tileSprite(0, 0, size.width, size.height, ASSET_KEYS.NORMAL_BACKGROUND)
    .setOrigin(0, 0)
    this.background2 = this.add.tileSprite(0, 0, size.width, size.height, ASSET_KEYS.MENU_BACKGROUND)
    .setOrigin(0, 0)
   
    //"Spriteformer" title
    this.titleText = this.add.bitmapText(260, 100, ASSET_KEYS.FONT, "You Win!", 100);
    this.onStart();

    //Button to Change Scene to First Level
    const startButton = this.add.bitmapText(370, 400, ASSET_KEYS.FONT, "Restart", 60);
    startButton.setInteractive();
    startButton.on("pointerdown", function (pointer) {this.scene.start("GameScene"); this.buttonSound.play(); this.music.stop(musicConfig);}, this);

    //music & audio
    this.buttonSound = this.sound.add(ASSET_KEYS.SOUND.BUTTON_PRESS, {volume: 0.5});

    this.music = this.sound.add(ASSET_KEYS.SOUND.MENU);

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
      targets: this.titleText,
      alpha: 0.5,
      ease: 'Power1',
      duration: 2000,
      repeat: -1,
      yoyo: true
    });
  }
}