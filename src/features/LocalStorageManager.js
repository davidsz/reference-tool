let instance;

class LocalStorageManager {
    constructor() {
        if (instance) throw new Error("You can only create one instance of LocalStorageManager.");
        instance = this;

        // Reserved key for saving current application state
        this.CURRENT = "current-state";
    }

    set(key, value) {
        localStorage.setItem(key, JSON.stringify({
            date: new Date().getTime(),
            value: value
        }));
    }

    get(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    remove(key) {
        localStorage.removeItem(key);
    }
}

const singletonLocalStorageManager = new LocalStorageManager();
export default singletonLocalStorageManager;
