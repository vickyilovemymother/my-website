export class StateManager {
    constructor() {
        this.state = {
            gender: 'Men', // Default
            viewMode: 'mix', // 'mix' or 'dress'
            activeItems: {
                top: null,
                bottom: null,
                jacket: null,
                comboset: null
            },
            colors: {
                top: '#ffffff',
                bottom: '#ffffff',
                jacket: '#ffffff'
            }
        };
    }

    updateState(key, value) {
        this.state[key] = value;
        console.log("State Updated:", this.state);
        // You can trigger a CustomEvent here for the UI to listen to
        window.dispatchEvent(new CustomEvent('stateChanged', { detail: this.state }));
    }
}
