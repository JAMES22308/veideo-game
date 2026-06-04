import Phaser from "phaser";
import SaveManager from "./SaveManager";
import MusicManager from "./MusicManager";
import VisibilityManager from "./VisibilityManager";

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
    }




    preload() {
        this.load.audio("menu_music", "src/assets/audios/bg_music.mp3");
    }




    create() {
        const { width, height } = this.scale;
        // const save = SaveManager.load();
        // this.hasSave = !!save;
        // this.saveData = save;

        const save = SaveManager.load();
        this.saveData = save;

        const isGameOver = save?.gameOver === true;
        const hasProgress = save && save?.gameOver !== true;
        this.clouds = [];
        this.drones = [];

        // const settings = JSON.parse(localStorage.getItem("gameSettings")) || {
        //     volume: 0.5,
        //     musicOn: true
        // };




        const settings = JSON.parse(localStorage.getItem("gameSettings")) || {
            volume: 0.5,
            musicOn: true,
            difficulty: 0.5,
            visibilityOn: false
        };

        // 🌌 BACKGROUND
        if (settings.visibilityOn) {
            this.cameras.main.setBackgroundColor("#69c4fd"); // brighter
        } else {
            this.cameras.main.setBackgroundColor("#87CEEB"); // normal
        }

        // 🏷 TITLE
        this.add.text(width / 2, 200, "2D AI JUMP", {
            fontSize: "48px",
            fontStyle: "bold",
            color: "#000",
            fontFamily: "Arial"
        }).setOrigin(0.5);


const groundColor = settings.visibilityOn ? 0x40b016 : 0x22c55e;
        
      this.add.rectangle(
            width / 2,        // center X
            height - 40,      // bottom position
            width,            // full screen width
            80,               // height of grass
            groundColor         // green color
        );

        // 🎮 BUTTONS (CENTERED)
        // this.createButton("PLAY", -90, "#A7F3D0", () => {
        //     this.scene.start("GameScene");
        // });

        // this.createButton("RESET SAVE", 310, "#EF4444", () => {
        // localStorage.removeItem("game_save");
        //     console.log("🧹 Save cleared!");

        //     // optional: restart menu to reflect clean state
        //     this.scene.restart();
        // });


        // this.createButton("PLAY", -90, "#A7F3D0", () => {

        // const save = SaveManager.load();

        // if (save?.scene) {
        //     this.scene.start(save.scene, {
        //         coinsCollected: save.coinsCollected,
        //         score: save.score,
        //         lives: save.lives,
        //         level: save.level,
        //         loaded: true
        //     });
        // } else {
        //     this.scene.start("GameScene");
        // }
        // });

      
        










// if (this.hasSave) {

//     this.createButton("CONTINUE", -90, "#A7F3D0", () => {
// this.scene.start(this.saveData.scene, {
//     level: this.saveData.level,
//     lives: this.saveData.lives,
//     coinsCollected: this.saveData.coinsCollected,
//     score: save.levelStartScore,
//     levelStartScore: this.saveData.levelStartScore
// });
//     });

//     this.createButton("NEW GAME", -10, "#FBBF24", () => {
// SaveManager.save({
//     level: 1,
//     lives: 3,
//     coinsCollected: 0,
//     levelStartScore: 0,
//     scene: "GameScene"
// });

//         this.scene.start("GameScene", {
//             level: 1,
//             score: 0,
//             coinsCollected: 0
//         });
//     });

// } else {

//     this.createButton("PLAY", -90, "#A7F3D0", () => {
//     const save = SaveManager.load();

//     this.scene.start("GameScene", {
//         level: 1,
//         score: 0,
//         lives: 3,

//         // 🔥 KEEP MONEY (coins) FROM SAVE
//         coinsCollected: save?.coinsCollected ?? 0
//     });
// });
// }





if (hasProgress) {

    this.createButton("CONTINUE", -90, "#A7F3D0", () => {
        this.scene.start(this.saveData.scene, {
            level: this.saveData.level,
            lives: this.saveData.lives,
            coinsCollected: this.saveData.coinsCollected,
            score: this.saveData.levelStartScore,
            levelStartScore: this.saveData.levelStartScore
        });
    });

    this.createButton("NEW GAME", -170, "#f5c54d", () => {
        SaveManager.save({
            level: 1,
            lives: 3,
            coinsCollected: 0,
            levelStartScore: 0,
            scene: "GameScene",
            gameOver: false
        });

        this.scene.start("GameScene", {
            level: 1,
            score: 0,
            coinsCollected: 0
        });
    });

} else {

    this.createButton("PLAY", -90, "#A7F3D0", () => {
        const save = SaveManager.load();

        this.scene.start("GameScene", {
            level: 1,
            score: 0,
            lives: 3,
            coinsCollected: save?.coinsCollected ?? 0
        });
    });
}









        this.createButton("HOW TO PLAY", -10, "#93C5FD", () => {
            this.scene.start("HowToPlayScene");
        });

        this.createButton("MARKET", 70, "#FBBF24", () => {
            this.scene.start("MarketScene");
        });

        this.createButton("OPTION", 149, "#D1D5DB", () => {
            this.scene.start("OptionScene");
        });

        this.createButton("EXIT", 230, "#FCA5A5", () => {
            window.close()
        });



        this.createCloud(200, 120, 0.3);
        this.createCloud(500, 180, 0.2);
        this.createCloud(800, 100, 0.4);
        this.createCloud(1200, 160, 0.25);



        this.createDrone(200, 150, 1);
        this.createDrone(600, 200, 1.2);
        this.createDrone(1000, 120, 0.8);


// if (settings.musicOn) {
//     MusicManager.play(this, "menu_music", settings.volume);
// } else {
//     MusicManager.stop();
// }


    }





    boostHex(hexString, factor = 1.5, enabled) {
    if (!enabled) return Phaser.Display.Color.HexStringToColor(hexString).color;

    let hex = Phaser.Display.Color.HexStringToColor(hexString).color;

    let r = (hex >> 16) & 255;
    let g = (hex >> 8) & 255;
    let b = hex & 255;

    r = Math.min(255, r * factor);
    g = Math.min(255, g * factor);
    b = Math.min(255, b * factor);

    return (r << 16) | (g << 8) | b;
}







update() {
        const { width } = this.scale;

       this.clouds.forEach((cloud) => {
            cloud.x += cloud.speed;

            cloud.y += Math.sin((cloud.floatSeed + cloud.x) * 0.005) * 0.2;

            if (cloud.x > this.scale.width + 100) {
                cloud.x = -100;
            }
        });

this.drones.forEach((d) => {
    d.x += d.speed;

    // 🌊 simple floating
    d.y += Math.sin(d.x * 0.01) * 0.3;

    // 🔴 BLINKING LIGHT
    d.blinkTimer++;

    if (d.blinkTimer > 20) {
        d.light.setVisible(!d.light.visible);
        d.blinkTimer = 0;
    }

    // reset position
    if (d.x > this.scale.width + 50) {
        d.x = -50;
    }
});
    }

createDrone(x, y, speed) {
    let body = this.add.rectangle(x, y, 30, 10, 0x374151);
    let wing1 = this.add.rectangle(x - 15, y - 5, 20, 4, 0x6b7280);
    let wing2 = this.add.rectangle(x + 15, y - 5, 20, 4, 0x6b7280);

    // 🔴 RED LIGHT (blink effect)
    let light = this.add.circle(x, y + 5, 3, 0xff0000, 1);

    let drone = this.add.container(0, 0, [body, wing1, wing2, light]);

    drone.x = x;
    drone.y = y;
    drone.speed = speed;

    drone.light = light;
    drone.blinkTimer = 0;

    this.drones.push(drone);
}

// getEnhancedColor(color) {
//     const baseColor = Phaser.Display.Color.HexStringToColor(color).color;
//     return VisibilityManager.boostHex(baseColor, this.settings?.visibilityOn);
// }

createButton(text, offsetY, color, callback) {
    const { width, height } = this.scale;

    const x = width / 2;
    const y = height / 2 + offsetY;

    // 🎮 BUTTON BASE
let baseColor = Phaser.Display.Color.HexStringToColor(color).color;

let btn = this.add.rectangle(
    x,
    y,
    260,
    55,
    VisibilityManager.hex(color)
);

    // 🧱 THICK BORDER (7px style look)
    btn.setStrokeStyle(7, 0x000000);
    btn.setInteractive({ useHandCursor: true });

    // 🏷 LABEL
    let label = this.add.text(x, y, text, {
        fontSize: "20px",
        color: "#000",
        fontStyle: "bold",
        fontFamily: "Arial",
    }).setOrigin(0.5);

    // 🎬 SMOOTH SCALE VALUES
    let normalScale = 1;
    let hoverScale = 1.08;

    // 🎞️ HOVER (SMOOTH ANIMATION)
    btn.on("pointerover", () => {
        this.tweens.add({
            targets: [btn, label],
            scaleX: hoverScale,
            scaleY: hoverScale,
            duration: 250,   // slow motion feel
            ease: "Power2"
        });
    });

    btn.on("pointerout", () => {
        this.tweens.add({
            targets: [btn, label],
            scaleX: normalScale,
            scaleY: normalScale,
            duration: 250,
            ease: "Power2"
        });
    });

    // 👆 CLICK
    btn.on("pointerdown", callback);
}

createCloud(x, y, speed) {
    let cloud = this.add.container(x, y);

    const color = 0xffffff;

    // ☁️ 3 overlapping circles ONLY
    let c1 = this.add.circle(0, 0, 30, color, 1);
    let c2 = this.add.circle(-22, 5, 25, color, 1);
    let c3 = this.add.circle(22, 5, 25, color, 1);

    cloud.add([c1, c2, c3]);

    cloud.speed = speed;
    cloud.floatSeed = Math.random() * 1000;

    this.clouds.push(cloud);
}
}