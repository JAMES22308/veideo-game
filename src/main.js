import Phaser from "phaser";
import MenuScene from "./scenes/MenuScene";
import HowToPlayScene from "./scenes/HowToPlayScene";
import OptionScene from "./scenes/OptionScene";
import GameScene from "./scenes/GameScene";
import Level2Scene from "./scenes/Level2Scene.js";
import MarketScene from "./scenes/MarketScene.js";


const isMobile = window.innerWidth < 768;
const config = {
    type: Phaser.AUTO,
    // width: window.innerWidth,
    // height: window.innerHeight,
    width: isMobile ? 800 : 2000,
    height: isMobile ? 1280 : 940,
    render: {
    antialias: false,
    pixelArt: false
},

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },

    scene: [MenuScene, HowToPlayScene,MarketScene, OptionScene, GameScene, Level2Scene]
    // scene: [Level2Scene]
};

new Phaser.Game(config);