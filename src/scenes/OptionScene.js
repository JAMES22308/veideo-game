import Phaser from "phaser";
import MusicManager from "./MusicManager";
export default class OptionScene extends Phaser.Scene {
    constructor() {
        super("OptionScene");
    }

    saveSettings() {
        localStorage.setItem("gameSettings", JSON.stringify(this.settings));
    }

    create() {

        this.drones = [];

        this.settings = JSON.parse(localStorage.getItem("gameSettings")) || {
            volume: 0.5,
            difficulty: 0.5,
            musicOn: true,
            sfxOn: true,
            visibilityOn: false
        };


        this.defaultSettings = {
            volume: 0.5,
            difficulty: 0.5,
            musicOn: true,
            sfxOn: true,
            visibilityOn: false
        };


        const { width, height } = this.scale;

        let resetSettingsBtn = this.add.rectangle(width / 2, height / 2 + 350, 220, 50, 0xef4444);
        resetSettingsBtn.setStrokeStyle(3, 0x000000);
        resetSettingsBtn.setInteractive({ useHandCursor: true });

        this.add.text(width / 2, height / 2 + 350, "RESET SETTINGS", {
            fontSize: "16px",
            fontStyle: "bold",
            color: "#000"
        }).setOrigin(0.5);


        resetSettingsBtn.on("pointerdown", () => {
            // reset settings object
            this.settings = { ...this.defaultSettings };

            // save to localStorage
            this.saveSettings();

            console.log("⚙️ Settings reset to default");

            // reload UI (sliders + toggles refresh)
            this.scene.restart();
        });

        this.cameras.main.setBackgroundColor("#E0F2FE");

        // ======================
        // 🔙 MENU BUTTON (TOP LEFT)
        // ======================
        let menuBtn = this.add.rectangle(90, 60, 140, 50,  0xfca5a5);
        menuBtn.setStrokeStyle(4, 0x000000);
        menuBtn.setInteractive({ useHandCursor: true });

        let menuText = this.add.text(90, 60, "MENU", {
            fontSize: "20px",
            fontStyle: "bold",
            color: "black",
            
        }).setOrigin(0.5);

        menuBtn.on("pointerdown", () => {
            this.scene.start("MenuScene");
        });









        // ======================
        // 📦 MAIN BANNER
        // ======================
        let panel = this.add.rectangle(
            width / 2,
            height / 2,
            850,
            550,
            0xffffff,
            0.9
        );

        panel.setStrokeStyle(6, 0x000000);

        // 🏷 TITLE
        this.add.text(width / 2, 90, "OPTIONS", {
            fontSize: "44px",
            fontStyle: "bold",
            color: "#000"
        }).setOrigin(0.5);

        // ======================
        // 🔊 VOLUME SLIDER
        // ======================
        this.createSlider(1, "Volume", 250, (value) => {
            console.log("Volume:", value);
        });

        // 🎵 MUSIC TOGGLE
        this.createToggle(2, "Music", 330);

        // 🔊 SFX TOGGLE
        this.createToggle(3, "Sound Effects", 420);

        // 👁 ENHANCED VISIBILITY TOGGLE
        this.createToggle(4, "Enhanced Visibility", 510);

        // 🎮 DIFFICULTY SLIDER
        this.createSlider(5, "Difficulty", 600, (value) => {
            console.log("Difficulty:", value);
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

    // ======================
    // 🎚 SLIDER
    // ======================
createSlider(index, label, y, callback) {
    const { width } = this.scale;

    this.add.text(width / 2 - 320, y, label, {
        fontSize: "20px",
        color: "#000",
        fontStyle: "bold"
    });

    let track = this.add.rectangle(width / 2 + 50, y, 300, 8, 0x9ca3af);

    let minX = width / 2 - 100;
    let maxX = width / 2 + 200;

    let initialValue =
        label === "Volume"
            ? this.settings.volume
            : this.settings.difficulty;

    let knob = this.add.circle(
        Phaser.Math.Linear(minX, maxX, initialValue),
        y,
        12,
        0x22c55e
    );

    knob.setInteractive({ draggable: true });
    this.input.setDraggable(knob);

    knob.on("drag", (pointer, dragX) => {
        knob.x = Phaser.Math.Clamp(dragX, minX, maxX);

        let value = (knob.x - minX) / (maxX - minX);

        // 💾 SAVE VALUE
        if (label === "Volume") {
            this.settings.volume = value;
        } else if (label === "Difficulty") {
            this.settings.difficulty = value;
        }

        this.saveSettings();
        callback(value);
    });
}

    // ======================
    // 🔘 TOGGLE
    // ======================
createToggle(index, label, y) {
    const { width } = this.scale;

    this.add.text(width / 2 - 320, y, label, {
        fontSize: "20px",
        color: "#000",
        fontStyle: "bold"
    });

    let bg = this.add.rectangle(width / 2 + 180, y, 70, 30, 0xd1d5db);
    bg.setStrokeStyle(3, 0x000000);
    bg.setInteractive({ useHandCursor: true });

    let knob = this.add.circle(width / 2 + 160, y, 12, 0xffffff);
    knob.setStrokeStyle(2, 0x000000);

    // 💾 LOAD STATE
    let state =
        label === "Music"
            ? this.settings.musicOn
            : label === "Sound Effects"
            ? this.settings.sfxOn
            : this.settings.visibilityOn;

    if (state) {
        knob.x = width / 2 + 200;
        bg.setFillStyle(0x3b82f6);
    }

bg.on("pointerdown", () => {
    state = !state;

    if (state) {
        knob.x = width / 2 + 200;
        bg.setFillStyle(0x3b82f6); // 🔵 ON (BLUE)
    } else {
        knob.x = width / 2 + 160;
        bg.setFillStyle(0xd1d5db); // ⚪ OFF (GRAY)
    }

    // save state
if (label === "Music") {
    this.settings.musicOn = state;
    this.saveSettings();

    if (state) {
        MusicManager.play(this.scene.get("MenuScene"), "menu_music", this.settings.volume);
    } else {
        MusicManager.stop();
    }
}

if (label === "Sound Effects") {
    this.settings.sfxOn = state;
    this.saveSettings();

}

if (label === "Enhanced Visibility") {
    this.settings.visibilityOn = state;
    this.saveSettings();
}

if (label === "Difficulty") {
    this.settings.difficulty = value;
}

    // this.saveSettings();
});
}
}