export default class PlayScene extends Phaser.Scene {
    constructor() {
        super("PlayScene");
    }

    create() {

        this.cameras.main.setBackgroundColor("#87CEEB");

        this.add.text(100, 100, "PLAY SCENE (Game starts here)", {
            fontSize: "28px",
            color: "#000"
        });

        this.backButton();

        

    }


    backButton() {
        let back = this.add.text(100, 200, "BACK", {
            fontSize: "24px",
            backgroundColor: "#FCA5A5",
            padding: { x: 10, y: 5 }
        }).setInteractive();

        back.on("pointerdown", () => {
            this.scene.start("MenuScene");
        });
    }
}