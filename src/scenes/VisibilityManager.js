import Phaser from "phaser";

export default class VisibilityManager {

    static isOn() {
        const settings = JSON.parse(localStorage.getItem("gameSettings")) || {};
        return settings.visibilityOn ?? false;
    }

    static convert(color) {
        if (!this.isOn()) return color;

        const map = {
            // 🔵 BLUE → BRIGHT CYBER BLUE
            "#A7F3D0": "#08f583",

            // 🔵 LIGHT BLUE → VERY BRIGHT BLUE
            "#93C5FD": "#1b6cf8",

            // ⚪ GRAY → BRIGHTER UI GRAY (not dark, still visible)
            "#D1D5DB": "#f1f5fa",

            // 🟡 YELLOW → BRIGHT ORANGE-YELLOW
            "#FBBF24": "#5ff823",

            // 🔴 RED → NEON RED
            "#EF4444": "#e20f3a",
        };

        return map[color.toUpperCase()] || color;
    }

    static hex(color) {
        return Phaser.Display.Color.HexStringToColor(this.convert(color)).color;
    }
}