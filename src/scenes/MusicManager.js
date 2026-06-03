// export default class MusicManager {
//     static music = null;

//     static play(scene, key, volume = 0.5) {
//         if (!this.music) {
//             this.music = scene.sound.add(key, {
//                 loop: true,
//                 volume: volume
//             });
//         }

//         this.music.setVolume(volume);

//         if (!this.music.isPlaying) {
//             this.music.play();
//         }
//     }

//     static stop() {
//         if (this.music) {
//             this.music.stop();
//         }
//     }

//     static setVolume(volume) {
//         if (this.music) {
//             this.music.setVolume(volume);
//         }
//     }
// }

export default class MusicManager {
    static current = null;
    static currentKey = null;

    static play(scene, key, volume = 0.5) {

        // If same music already playing, do nothing
        if (this.currentKey === key && this.current) {
            return;
        }

        // stop old music
        if (this.current) {
            this.current.stop();
        }

        // play new music
        this.current = scene.sound.add(key, {
            loop: true,
            volume: volume
        });

        this.currentKey = key;
        this.current.play();
    }

    static stop() {
        if (this.current) {
            this.current.stop();
            this.current = null;
            this.currentKey = null;
        }
    }

    static setVolume(volume) {
        if (this.current) {
            this.current.setVolume(volume);
        }
    }
}