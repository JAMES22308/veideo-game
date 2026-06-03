export default class SettingsManager {

    static defaultSettings = {
        volume: 0.5,
        musicOn: true,
        sfxOn: true,
        visibilityOn: false,
        difficulty: 0.5
    };

    static load() {
        return JSON.parse(localStorage.getItem("gameSettings")) 
            || this.defaultSettings;
    }

    static save(settings) {
        localStorage.setItem("gameSettings", JSON.stringify(settings));
    }

    static get(key) {
        return this.load()[key];
    }

    static set(key, value) {
        const settings = this.load();
        settings[key] = value;
        this.save(settings);
    }
}