export class StateManager {
  constructor() {
    this.state = {
      gender: "Men",
      mannequin: null,
      mode: "mix", // mix or dress

      garments: {
        top: null,
        bottom: null,
        jacket: null,
        dress: null
      },

      colors: {
        top: "#ffffff",
        bottom: "#ffffff",
        jacket: "#ffffff",
        dress: "#ffffff"
      }
    };
  }

  setGender(gender) {
    this.state.gender = gender;
  }

  setMannequin(model) {
    this.state.mannequin = model;
  }

  setMode(mode) {
    this.state.mode = mode;
  }

  setGarment(type, model) {
    this.state.garments[type] = model;
  }

  setColor(type, color) {
    this.state.colors[type] = color;
  }

  getState() {
    return this.state;
  }
}
