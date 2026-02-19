export class StateManager {
  constructor() {
    this.state = {
      gender: "men",
      mode: "mix"
    };
  }

  setGender(gender) {
    this.state.gender = gender;
  }

  getGender() {
    return this.state.gender;
  }

  setMode(mode) {
    this.state.mode = mode;
  }

  getMode() {
    return this.state.mode;
  }
}
