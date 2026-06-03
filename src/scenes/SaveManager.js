const SaveManager = {

    // 🎮 SAVE GAME ONLY
    save(data) {
        localStorage.setItem("game_save", JSON.stringify({
            type: "game_save",
            ...data
        }));
    },

    // 📥 LOAD GAME ONLY
    load() {
        const data = localStorage.getItem("game_save");
        return data ? JSON.parse(data) : null;
    },

    // 🧹 CLEAR GAME SAVE ONLY
    clear() {
        localStorage.removeItem("game_save");
    }
};

export default SaveManager;