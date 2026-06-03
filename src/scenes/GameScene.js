import Phaser from "phaser";
import SaveManager from "./SaveManager";
import MusicManager from "./MusicManager";


export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }







    

    // preload() {

    //     // 👤 PLAYER WALK
    //     this.load.spritesheet("player", "assets/sprites/protagonist/player5.png", {
    //         frameWidth: 128,
    //         frameHeight: 128
    //     });

    //     // 🦘 PLAYER JUMP
    //     this.load.spritesheet("playerJump", "assets/sprites/protagonist/player_jumping1.png", {
    //         frameWidth: 128,
    //         frameHeight: 128
    //     });


    //         // this.load.image("enemyRun", "assets/obstacles/enemyrunning1.png");
    //         this.load.spritesheet("enemyRun", "assets/sprites/obstacles/enemyrunning2.png", {
    //         frameWidth: 128,
    //         frameHeight: 128
    // });


    // this.load.spritesheet("enemyAttack", "assets/sprites/obstacles/enemyattack2.png", {
    //     frameWidth: 128,
    //     frameHeight: 128
    // });
    // }



    preload() {

    // ==========================================
    // 👤 PLAYER WALKING SPRITESHEET
    // Used for player movement animation
    // ==========================================
    this.load.spritesheet(
        "player",
        "assets/sprites/protagonist/player5.png",
        {
            frameWidth: 128,
            frameHeight: 128
        }
    );
    this.load.audio("gameplay_music", "assets/audios/gameplay_music.mp3");
    this.load.audio("collect_coin", "src/assets/audios/collecting_coin.mp3");
    this.load.audio("sword_swing", "assets/audios/sword_swing.mp3");

    // ==========================================
    // 🦘 PLAYER JUMPING SPRITESHEET
    // Used when player is in the air
    // ==========================================
    this.load.spritesheet(
        "playerJump",
        "assets/sprites/protagonist/player_jumping1.png",
        {
            frameWidth: 128,
            frameHeight: 128
        }
    );

    // ==========================================
    // 👾 ENEMY RUNNING SPRITESHEET
    // Used for enemy patrol animation
    // ==========================================
    this.load.spritesheet(
        "enemyRun",
        "assets/sprites/obstacles/enemyrunning2.png",
        {
            frameWidth: 128,
            frameHeight: 128
        }
    );

    // ==========================================
    // 👾 ENEMY ATTACK SPRITESHEET
    // Used when enemy attacks player
    // ==========================================
    this.load.spritesheet(
        "enemyAttack",
        "assets/sprites/obstacles/enemyattack2.png",
        {
            frameWidth: 128,
            frameHeight: 128
        }
    );
}


















    create() {


        this.isGameOver = false;
        this.inQuestion = false;

        this.enemySwingPlayed = false;
        

        const { width, height } = this.scale;

        // 🌌 SKY
        this.cameras.main.setBackgroundColor("#87CEEB");

        // 🟩 GROUND
        this.ground = this.add.rectangle(width / 2, height - 40, width, 80, 0x22c55e);
        this.physics.add.existing(this.ground, true);


        
        const settings = JSON.parse(localStorage.getItem("gameSettings")) || {
            volume: 0.5,
            musicOn: true,
            difficulty: 0.5
        };
        this.difficulty = settings.difficulty ?? 0.5;

        this.coinSound = this.sound.add("collect_coin");

        // 👤 PLAYER
        this.player = this.physics.add.sprite(60, height - 150, "player");
        this.player.setScale(0.6);
        this.player.setOrigin(0.5, 1);
        this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, this.ground);

        // 🎮 INPUT
        this.cursors = this.input.keyboard.createCursorKeys();

        // 🚶 WALK ANIMATION
        this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNumbers("player", {
                start: 0,
                end: 3
            }),
            frameRate: 8,
            repeat: -1
        });

        this.player.setFrame(0);


        this.player.maxLives = 3;
        this.player.invincible = false;
        this.player.invincibleTime = 800; // ms

     




        this.anims.create({
            key: "enemyAttackAnim",
            frames: this.anims.generateFrameNumbers("enemyAttack", {
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });

    // =========================
    // 🪜 PLATFORMS
    // =========================

    this.platform1 = this.add.rectangle(380, height - 180, 350, 40, 0x22c55e);
    this.physics.add.existing(this.platform1, true);

    this.platform2 = this.add.rectangle(620, height - 320, 250, 40, 0x22c55e);
    this.physics.add.existing(this.platform2, true);

    this.platform3 = this.add.rectangle(860, height - 420, 400, 40, 0x22c55e);
    this.physics.add.existing(this.platform3, true);

    this.platform4 = this.add.rectangle(1050, height - 300, 300, 40, 0x22c55e);
    this.physics.add.existing(this.platform4, true);

    this.platform5 = this.add.rectangle(1500, height - 380, 350, 40, 0x22c55e);
    this.physics.add.existing(this.platform5, true);

    this.physics.add.collider(this.player, this.platform1);
    this.physics.add.collider(this.player, this.platform2);
    this.physics.add.collider(this.player, this.platform3);
    this.physics.add.collider(this.player, this.platform4);
    this.physics.add.collider(this.player, this.platform5);




    // =========================
    // 📊 UI (TOP RIGHT)
    // =========================

    // this.coinsCollected = 0;
    // this.score = 0;
    // this.lives = 3;
    // this.level = 1;

    this.level = this.level ?? 1;
this.score = this.score ?? 0;
this.coinsCollected = this.coinsCollected ?? 0;
this.lives = this.lives ?? 3;

    this.uiText = this.add.text(this.scale.width - 20, 20, "", {
        fontSize: "22px",
        color: "#000",
        fontStyle: "bold"
    }).setOrigin(1, 0);

    this.updateUI = () => {
        this.uiText.setText(
            `Level: ${this.level}   Lives: ${this.lives}   Coins: ${this.coinsCollected}   Score: ${this.score}`
        );
    };

    this.updateUI();

    // =========================
    // 🔘 MENU BUTTON (FIXED 100%)
    // =========================

    const x = 20;
    const y = 20;

    // create ONE clickable object first
    const menuButton = this.add.rectangle(x, y, 120, 45, 0xc0392b)
        .setOrigin(0, 0)
        .setInteractive({ useHandCursor: true })
        .setScrollFactor(0)
        .setDepth(1001);

    // text on top (NOT interactive)
    const menuText = this.add.text(x + 60, y + 22, "MENU", {
        fontSize: "18px",
        color: "#000",
        fontStyle: "bold"
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1002);

    // hover effect
    menuButton.on("pointerover", () => {
        menuButton.setFillStyle(0xe74c3c);
    });

    menuButton.on("pointerout", () => {
        menuButton.setFillStyle(0xc0392b);
    });

    // click
    menuButton.on("pointerdown", () => {
        console.log("MENU CLICKED");
        MusicManager.stop()
        this.scene.start("MenuScene");
    });

    // =========================
    // 🪙 COINS
    // =========================

    this.coins = this.physics.add.staticGroup();

    const coinData = [
        { x: 380, y: height - 250, type: "small" },
        { x: 620, y: height - 380, type: "big" },
        { x: 860, y: height - 480, type: "small" },
        { x: 970, y: height - 360, type: "big" },
        { x: 1500, y: height - 480, type: "small" }
    ];

    coinData.forEach(data => {

        const size = data.type === "big" ? 16 : 10;

        const coin = this.add.circle(data.x, data.y, size, 0xffd700);
        this.physics.add.existing(coin, true);

        coin.type = data.type;

        this.coins.add(coin);

        const label = this.add.text(data.x, data.y, "$", {
            fontSize: data.type === "big" ? "16px" : "12px",
            color: "#000",
            fontStyle: "bold"
        }).setOrigin(0.5);

        coin.label = label;

        this.tweens.add({
            targets: [coin, label],
            y: coin.y - 8,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut"
        });
    });

    this.physics.add.overlap(
        this.player,
        this.coins,
        this.collectCoin,
        null,
        this
    );



// =========================
// 🚪 DOOR (DESIGNED VERSION)
// =========================

const doorX = 1870;
const doorY = height - 140;

// shadow (gives depth)
const doorShadow = this.add.rectangle(
    doorX + 4,
    doorY + 4,
    70,
    110,
    0x000000,
    0.3
);

// frame (outer border)
const doorFrame = this.add.rectangle(
    doorX,
    doorY,
    70,
    110,
    0x2c3e50
);

// main door
const doorBody = this.add.rectangle(
    doorX,
    doorY,
    60,
    100,
    0x8e44ad
);

// highlight (shine effect)
const doorGlow = this.add.rectangle(
    doorX - 10,
    doorY - 10,
    10,
    90,
    0xffffff,
    0.15
);

// text
const doorText = this.add.text(doorX, doorY, "EXIT", {
    fontSize: "14px",
    color: "#ffffff",
    fontStyle: "bold"
}).setOrigin(0.5);
this.door = this.add.rectangle(doorX, doorY, 60, 100, 0x000000, 0)
    .setOrigin(0.5);

this.physics.add.existing(this.door, true);

this.physics.add.overlap(this.player, this.door, this.reachDoor, null, this);


// =========================
// 👾 ENEMY (FIXED PLATFORM ALIGNMENT)
// =========================

const p = this.platform1;

// spawn enemy on the RIGHT side of platform
this.enemy = this.physics.add.sprite(p.x + 920, p.y - 1, "enemyRun");

this.enemy.setScale(0.6);
this.enemy.setOrigin(0.5, 1);
this.enemy.setCollideWorldBounds(true);

// gravity (same behavior as player)
this.enemy.setGravityY(800);

// platform collisions
this.physics.add.collider(this.enemy, this.ground);
this.physics.add.collider(this.enemy, this.platform1);
this.physics.add.collider(this.enemy, this.platform2);
this.physics.add.collider(this.enemy, this.platform3);
this.physics.add.collider(this.enemy, this.platform4);
this.physics.add.collider(this.enemy, this.platform5);

// 👇 IMPORTANT: start direction = LEFT
this.enemy.direction = -1;

// start moving LEFT immediately
this.enemy.setVelocityX(-80);


this.anims.create({
    key: "enemyRunAnim",
    frames: this.anims.generateFrameNumbers("enemyRun", {
        start: 0,
        end: 3
    }),
    frameRate: 10,
    repeat: -1
});

this.enemy.anims.play("enemyRunAnim", true);




const diff = this.difficulty ?? 0.5; 
// 0 = easy, 0.5 = normal, 1 = hard

// base values
const basePatrol = 90;
const baseAttack = 40;
const baseDetect = 50;

// make difficulty more aggressive (IMPORTANT PART)
const scaled = diff * diff; 
// 🔥 exponential curve (makes high difficulty MUCH harder)

this.enemy.state = "patrol";

// 👀 detection range (big difference when high diff)
this.enemy.detectRange = baseDetect + (scaled * 120);

// ⚔️ attack speed (VERY noticeable change)
this.enemy.attackSpeed = baseAttack + (scaled * 100);

// 🚶 patrol speed (faster movement pressure)
this.enemy.patrolSpeed = basePatrol + (scaled * 140);    // mas mataas difficulty = mas mabilis patrol

this.physics.add.overlap(
    this.player,
    this.enemy,
    this.onEnemyTouch,
    null,
    this
);






// =========================
// 👾 ENEMY 2 (ADDITIONAL)
// =========================

this.enemy2 = this.physics.add.sprite(640, height - 500, "enemyRun");

this.enemy2.setScale(0.6);
this.enemy2.setOrigin(0.5, 1);
this.enemy2.setGravityY(800);

this.enemy2.state = "patrol";
this.enemy2.detectRange = 50;
this.enemy2.attackSpeed = 40;
this.enemy2.direction = 1;

// collisions
this.physics.add.collider(this.enemy2, this.ground);
this.physics.add.collider(this.enemy2, this.platform1);
this.physics.add.collider(this.enemy2, this.platform2);
this.physics.add.collider(this.enemy2, this.platform3);
this.physics.add.collider(this.enemy2, this.platform4);
this.physics.add.collider(this.enemy2, this.platform5);

// damage overlap
this.physics.add.overlap(
    this.player,
    this.enemy2,
    this.onEnemyTouch,
    null,
    this
);

// start movement
this.enemy2.setVelocityX(80);
this.enemy2.anims.play("enemyRunAnim", true);


if (settings.musicOn) {
    MusicManager.play(this, "menu_music", settings.volume);
} else {
    MusicManager.stop();
}


}














init(data = {}) {
    this.level = data.level ?? 1;

    this.levelStartScore = data.levelStartScore ?? 0;
    this.score = this.levelStartScore;

    this.coinsCollected = data.coinsCollected ?? 0;
    this.lives = data.lives ?? 3;
}




saveGame() {
    SaveManager.save({
        level: this.level,
        lives: this.lives,
        coinsCollected: this.coinsCollected,
        score: this.score,
        levelStartScore: this.levelStartScore ?? 0,
        scene: this.scene.key   // ✅ important
    });
}









resetGameState() {
    this.isGameOver = false;
    this.inQuestion = false;

    this.lives = 3;
    this.score = 0;
    this.coinsCollected = 0;
    this.level = 1;
}


gameOver() {
    if (this.isGameOver) return;

    this.isGameOver = true;
    this.physics.pause();

    const { width, height } = this.scale;

    SaveManager.save({
        level: 1,
        lives: 3,
        coinsCollected: 0,
        levelStartScore: 0,
        scene: "GameScene",
        gameOver: true
    });

    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);

    this.add.text(width / 2, height / 2 - 80, "GAME OVER", {
        fontSize: "64px",
        color: "#ff0000"
    }).setOrigin(0.5);

    const menu = this.add.text(width / 2, height / 2 + 60, "MENU", {
        fontSize: "24px",
        backgroundColor: "#c0392b",
        padding: { x: 15, y: 8 }
    }).setOrigin(0.5).setInteractive();

    menu.on("pointerdown", () => {
        this.scene.start("MenuScene");
    });
}


resetAll() {
    this.isGameOver = false;
    this.inQuestion = false;

    this.lives = 3;
    this.score = 0;
    this.coinsCollected = 0;

    this.physics.resume();

    if (this.player) {
        this.player.clearTint();
        this.player.setAlpha(1);
    }
}







onEnemyTouch(player, enemy) {
    if (this.player.invincible) return;

    this.takeDamage();
}


takeDamage() {

    if (this.player.invincible) return;

    this.lives -= 1;
    this.updateUI();

    this.player.invincible = true;
    this.saveGame();

    // blink effect
    this.tweens.add({
        targets: this.player,
        alpha: 0.2,
        duration: 100,
        yoyo: true,
        repeat: 5
    });

    this.time.delayedCall(this.player.invincibleTime, () => {
        this.player.invincible = false;
        this.player.setAlpha(1);
    });

    if (this.lives <= 0 && !this.isGameOver) {
        this.gameOver();
    }
}












reachDoor(player, door) {
    // prevent multiple triggers
    if (this.inQuestion) return;

    this.inQuestion = true;

    this.physics.pause();
    player.setVelocity(0, 0);

    this.showAIQuestion();
}


showAIQuestion() {
    const { width, height } = this.scale;

    this.physics.pause();
    this.player.setVelocity(0, 0);
    this.inQuestion = true;

    // background
    this.questionBox = this.add.rectangle(width / 2, height / 2, 650, 320, 0x000000, 0.85);

    this.questionText = this.add.text(width / 2, height / 2 - 120,
        "🤖 Responsible AI Question:\n\nWhich is the correct and ethical use of AI?",
        {
            fontSize: "20px",
            color: "#ffffff",
            align: "center",
            wordWrap: { width: 600 }
        }
    ).setOrigin(0.5);

    // 4 choices ONLY (A–D)
    const choices = [
        { key: "A", text: "Using AI to cheat in exams", correct: false },
        { key: "B", text: "Using AI to copy assignments", correct: false },
        { key: "C", text: "Using AI to generate fake content", correct: false },
        { key: "D", text: "Using AI to help study and learn better", correct: true }
    ];

    this.choiceButtons = [];

    choices.forEach((choice, index) => {

        const btn = this.add.text(
            width / 2,
            height / 2 - 30 + index * 50,
            `${choice.key}. ${choice.text}`,
            {
                fontSize: "18px",
                color: "#ffffff",
                backgroundColor: "#2c3e50",
                padding: { x: 12, y: 6 }
            }
        )
        .setOrigin(0.5)
        .setInteractive();

        btn.on("pointerover", () => {
            btn.setStyle({ backgroundColor: "#34495e" });
        });

        btn.on("pointerout", () => {
            btn.setStyle({ backgroundColor: "#2c3e50" });
        });

        btn.on("pointerdown", () => {
            this.answerAI(choice.correct);
        });

        this.choiceButtons.push(btn);
    });
}








answerAI(isCorrect) {

    // remove question UI
    this.questionBox.destroy();
    this.questionText.destroy();
    this.choiceButtons.forEach(btn => btn.destroy());

    this.inQuestion = false;

    const { width, height } = this.scale;

    if (isCorrect) {

        // =========================
        // 🎉 CORRECT ANSWER
        // =========================

        this.add.rectangle(width / 2, height / 2, 600, 200, 0x27ae60, 0.9);

        this.add.text(width / 2, height / 2,
            "🎉 CONGRATULATIONS!\nYou used AI responsibly!",
            {
                fontSize: "28px",
                color: "#ffffff",
                align: "center"
            }
        ).setOrigin(0.5);

        this.time.delayedCall(2000, () => {
            this.level += 1;
            this.updateUI();
            // this.scene.start("Level2Scene");
            this.saveGame();
this.scene.start("Level2Scene", {
    coinsCollected: this.coinsCollected,
    lives: this.lives,
    level: this.level,
    levelStartScore: this.score
});
        });

    } else {

        // =========================
        // 💀 GAME OVER (INSTANT)
        // =========================

        this.physics.pause();

        this.add.rectangle(width / 2, height / 2, 800, 400, 0x000000, 0.85);

        this.add.text(width / 2, height / 2 - 80,
            "💀 GAME OVER",
            {
                fontSize: "48px",
                color: "#ff0000",
                fontStyle: "bold"
            }
        ).setOrigin(0.5);

        this.add.text(width / 2, height / 2 - 20,
            "Wrong answer on Responsible AI question",
            {
                fontSize: "20px",
                color: "#ffffff",
                align: "center"
            }
        ).setOrigin(0.5);

        // =========================
        // 🔘 TRY AGAIN
        // =========================
        const tryAgain = this.add.text(width / 2 - 120, height / 2 + 80,
            "TRY AGAIN",
            {
                fontSize: "24px",
                backgroundColor: "#27ae60",
                color: "#fff",
                padding: { x: 20, y: 10 }
            }
        )
        .setOrigin(0.5)
        .setInteractive();

tryAgain.on("pointerdown", () => {
    this.scene.start("GameScene", {
        level: this.level,
        lives: this.lives,
        coinsCollected: this.coinsCollected,
        levelStartScore: 0
    });
});

        // =========================
        // 🚪 EXIT
        // =========================
        const exit = this.add.text(width / 2 + 120, height / 2 + 80,
            "EXIT",
            {
                fontSize: "24px",
                backgroundColor: "#c0392b",
                color: "#fff",
                padding: { x: 20, y: 10 }
            }
        )
        .setOrigin(0.5)
        .setInteractive();

        exit.on("pointerdown", () => {
            this.scene.start("MenuScene");
        });
    }
}








collectCoin(player, coin) {

    if (coin.label) coin.label.destroy(); // remove $

    coin.destroy();
    const settings = JSON.parse(localStorage.getItem("gameSettings")) || {
        volume: 0.5,
        sfxOn: true
    };

    if (settings.sfxOn) {
        this.sound.play("collect_coin", {
            volume: settings.volume
        });
    }

    if (coin.type === "big") {
        this.coinsCollected += 5;
        this.score += 20;
    } else {
        this.coinsCollected += 1;
        this.score += 10;
    }

    this.updateUI();
      this.saveGame();
}

update() {



        // =========================
// 👾 ENEMY 2 AI
// =========================

if (this.enemy2 && this.player) {

    const distance2 = Phaser.Math.Distance.Between(
        this.enemy2.x,
        this.enemy2.y,
        this.player.x,
        this.player.y
    );

    if (distance2 < this.enemy2.detectRange) {

        this.enemy2.state = "attack";

        const dir = this.player.x < this.enemy2.x ? -1 : 1;

        this.enemy2.setVelocityX(dir * this.enemy2.attackSpeed);
        this.enemy2.setFlipX(dir < 0);

        this.enemy2.anims.play("enemyAttackAnim", true);
    }
    else {

        this.enemy2.state = "patrol";

        this.enemy2.setVelocityX(80 * this.enemy2.direction);

        if (this.enemy2.x > 1300) this.enemy2.direction = -1;
        if (this.enemy2.x < 900) this.enemy2.direction = 1;

        this.enemy2.setFlipX(this.enemy2.direction < 0);
        this.enemy2.anims.play("enemyRunAnim", true);
    }
}


        if (this.enemy && this.player) {

            const distance = Phaser.Math.Distance.Between(
                this.enemy.x,
                this.enemy.y,
                this.player.x,
                this.player.y
            );

            // =========================
            // 🔴 ATTACK MODE
            // =========================
           if (distance < this.enemy.detectRange) {

                if (!this.enemySwingPlayed) {

                const settings = JSON.parse(
                    localStorage.getItem("gameSettings")
                ) || {};

                if (settings.sfxOn) {
                    this.sound.play("sword_swing", {
                        volume: 1
                    });
                }

            this.enemySwingPlayed = true;
    }


    this.enemy.state = "attack";

    const direction = this.player.x < this.enemy.x ? -1 : 1;
    this.enemy.setVelocityX(direction * this.enemy.attackSpeed);
    this.enemy.setFlipX(direction < 0);

    this.enemy.anims.play("enemyAttackAnim", true);
} 
else {
    this.enemySwingPlayed = false;
    this.enemy.state = "patrol";

    this.enemy.setVelocityX(80 * this.enemy.direction);

    if (this.enemy.x >= 900) this.enemy.direction = -1;
    if (this.enemy.x <= 200) this.enemy.direction = 1;

    this.enemy.setFlipX(this.enemy.direction < 0);
    this.enemy.anims.play("enemyRunAnim", true);
}
        }
        

        // 🦘 AIR STATE
        if (!this.player.body.touching.down) {

            this.player.setTexture("playerJump");

            if (this.player.body.velocity.y < 0) {
                this.player.setFrame(1);
            } else {
                this.player.setFrame(2);
            }
        }

        // ⬅ LEFT
        else if (this.cursors.left.isDown) {

            this.player.setVelocityX(-200);
            this.player.anims.play("walk", true);
            this.player.setFlipX(true);
        }

        // ➡ RIGHT
        else if (this.cursors.right.isDown) {

            this.player.setVelocityX(200);
            this.player.anims.play("walk", true);
            this.player.setFlipX(false);
        }

        // 🛑 IDLE
        else {

            this.player.setVelocityX(0);
            this.player.anims.stop();

            this.player.setTexture("player");
            this.player.setFrame(0);
        }

        // ⬆ JUMP
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-500);
        }



        // =========================
        // 👾 ENEMY PATROL LOGIC
        // =========================





    }


    
}