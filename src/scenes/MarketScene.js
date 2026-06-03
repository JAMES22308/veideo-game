import Phaser from "phaser";

export default class MarketScene extends Phaser.Scene {
    constructor() {
        super("MarketScene");
    }

    create() {
        const { width, height } = this.scale;

        // ======================
        // BACKGROUND
        // ======================
        this.cameras.main.setBackgroundColor("#1e293b");

        // ======================
        // TITLE
        // ======================
        this.add.text(width / 2, 80, "MARKET", {
            fontSize: "42px",
            fontStyle: "bold",
            color: "#ffffff"
        }).setOrigin(0.5);

        // ======================
        // MAIN PANEL (CENTER FRAME)
        // ======================
        let panel = this.add.rectangle(
            width / 2,
            height / 2,
            1000,
            400,
            0x111827,
            0.9
        );

        panel.setStrokeStyle(6, 0xffffff);

        // ======================
        // CHARACTER CARDS DATA
        // ======================
        const items = [
            { name: "Knight", price: 100 },
            { name: "Robot", price: 200 },
            { name: "Ninja", price: 300 },
            { name: "Mage", price: 400 }
        ];

        // ======================
        // LAYOUT SETTINGS
        // ======================
        let startX = width / 2 - 450;
        let y = height / 2;

        // ======================
        // CREATE 4 CARDS
        // ======================
        items.forEach((item, i) => {
            let x = startX + i * 300;

            // CARD FRAME
            let card = this.add.rectangle(x, y, 260, 320, 0xf8fafc);
            card.setStrokeStyle(4, 0x000000);

            // IMAGE PLACEHOLDER
            let img = this.add.rectangle(x, y - 80, 120, 120, 0x94a3b8);

            // NAME
            this.add.text(x, y + 10, item.name, {
                fontSize: "22px",
                color: "#000",
                fontStyle: "bold"
            }).setOrigin(0.5);

            // PRICE
            this.add.text(x, y + 50, "Price: " + item.price, {
                fontSize: "18px",
                color: "#111"
            }).setOrigin(0.5);

            // BUY BUTTON
            let buyBtn = this.add.rectangle(x, y + 120, 140, 40, 0x22c55e);
            buyBtn.setStrokeStyle(3, 0x000000);
            buyBtn.setInteractive({ useHandCursor: true });

            this.add.text(x, y + 120, "BUY", {
                fontSize: "16px",
                color: "#000",
                fontStyle: "bold"
            }).setOrigin(0.5);

            buyBtn.on("pointerdown", () => {
                console.log("Buying:", item.name);
            });
        });

        // ======================
        // BACK BUTTON
        // ======================
        let backBtn = this.add.rectangle(100, 60, 140, 45, 0xef4444);
        backBtn.setStrokeStyle(3, 0x000000);
        backBtn.setInteractive({ useHandCursor: true });

        this.add.text(100, 60, "BACK", {
            fontSize: "16px",
            color: "#000",
            fontStyle: "bold"
        }).setOrigin(0.5);

        backBtn.on("pointerdown", () => {
            this.scene.start("MenuScene");
        });
    }
}