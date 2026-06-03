import Phaser from "phaser";


export default class HowToPlayScene extends Phaser.Scene {
    constructor() {
        super("HowToPlayScene");
    }

    create() {
        const { width, height } = this.scale;
        this.drones = [];

        this.cameras.main.setBackgroundColor("#E0F2FE");

        // 📦 MAIN BANNER
        let banner = this.add.rectangle(
            width / 2,
            height / 2 - 20,
            850,
            540,
            0xffffff,
            0.9
        );

        banner.setStrokeStyle(6, 0x000000);

        // 🏷 TITLE
        this.add.text(width / 2, 90, "HOW TO PLAY", {
            fontSize: "44px",
            fontStyle: "bold",
            color: "#000"
        }).setOrigin(0.5);

        // ======================
        // 🎯 OBJECTIVE
        // ======================
        this.add.text(width / 2 - 380, height / 2 - 220, "Objective:", {
            fontSize: "22px",
            fontStyle: "bold",
            color: "#000"
        });

        this.add.text(width / 2 - 380, height / 2 - 190,
            "Avoid obstacle, collect coins, and reach the DOOR to continue to the next level",
            {
                fontSize: "20px",
                color: "#111",
                wordWrap: { width: 760 }
            }
        );

        // ======================
        // 🎮 CONTROLS
        // ======================
        this.add.text(width / 2 - 380, height / 2 - 120, "Controls:", {
            fontSize: "22px",
            fontStyle: "bold",
            color: "#000"
        });

        this.add.text(width / 2 - 380, height / 2 - 90,
            "LEFT ARROW = move left\nRIGHT ARROW = move right\nUP ARROW = Jump",
            {
                fontSize: "20px",
                color: "#111"
            }
        );

        // ======================
        // 🪙 COINS
        // ======================
        this.add.text(width / 2 - 380, height / 2 - 10, "Coins:", {
            fontSize: "22px",
            fontStyle: "bold",
            color: "#000"
        });

        this.add.text(width / 2 - 380, height / 2 + 20,
            "Collect coins during gameplay to increase your score",
            {
                fontSize: "20px",
                color: "#111",
                wordWrap: { width: 760 }
            }
        );

        // ======================
        // ❓ QUESTION
        // ======================
        this.add.text(width / 2 - 380, height / 2 + 80, "Question:", {
            fontSize: "22px",
            fontStyle: "bold",
            color: "#000"
        });

        this.add.text(width / 2 - 380, height / 2 + 110,
            "After reaching the DOOR, answer the AI question correctly to proceed to the next level",
            {
                fontSize: "20px",
                color: "#111",
                wordWrap: { width: 760 }
            }
        );

        // ======================
        // ❌ WRONG ANSWER
        // ======================
        this.add.text(width / 2 - 380, height / 2 + 170, "Wrong Answer:", {
            fontSize: "22px",
            fontStyle: "bold",
            color: "#000"
        });

        this.add.text(width / 2 - 380, height / 2 + 200,
            "Wrong answers will result in GAME OVER",
            {
                fontSize: "20px",
                color: "#111"
            }
        );

        // ======================
        // 🎮 BUTTONS
        // ======================

        


        this.createButton(width / 2 - 10, height - 100, "BACK TO MENU", "#FCA5A5", () => {
            this.scene.start("MenuScene");
        });


        this.createDrone(200, 150, 1);
        this.createDrone(600, 200, 1.2);
        this.createDrone(1000, 120, 0.8);
    }

    update() {
        const { width } = this.scale;

       

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


    createButton(x, y, text, color, callback) {
        let btn = this.add.rectangle(
            x,
            y,
            200,
            55,
            Phaser.Display.Color.HexStringToColor(color).color
        );

        btn.setStrokeStyle(5, 0x000000);
        btn.setInteractive({ useHandCursor: true });

        let label = this.add.text(x, y, text, {
            fontSize: "20px",
            fontStyle: "bold",
            color: "#000"
        }).setOrigin(0.5);

        // ✨ HOVER EFFECT
        btn.on("pointerover", () => {
            this.tweens.add({
                targets: [btn, label],
                scaleX: 1.07,
                scaleY: 1.07,
                duration: 150,
                ease: "Power2"
            });
        });

        btn.on("pointerout", () => {
            this.tweens.add({
                targets: [btn, label],
                scaleX: 1,
                scaleY: 1,
                duration: 150,
                ease: "Power2"
            });
        });

        btn.on("pointerdown", callback);
    }
}