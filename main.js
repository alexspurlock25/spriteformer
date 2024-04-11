import './style.css'
import Phaser from "phaser";

const size = {
  width: 1000,
  height: 700,
};

const gravity = 100

class GameScene extends Phaser.Scene {
  constructor() {
    super("game-scene");
  }

  // prelaod assets here
  preload() {}

  // handle the preloaded assets here
  create() {
    this.add.text(
      size.width / 2 - 70, 
      size.height / 2, 
      "Hello, World!"
    );
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