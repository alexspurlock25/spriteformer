import './style.css'
import Phaser from "phaser";

const size = {
    width: 1000,
    height: 700,
};

class GameScene extends Phaser.Scene {
    constructor() {
      super("game-scene");
    }
  
    preload() { 
        
    }
  
    create() {
        this.add.text(
            size.width / 2 - 70, 
            size.height / 2, 
            "Hello, World!"
        );
     }
  
    update() {
        
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
        gravity: { y: 1 },
      },
    },
    scene: [GameScene],
};
  
const game = new Phaser.Game(config);