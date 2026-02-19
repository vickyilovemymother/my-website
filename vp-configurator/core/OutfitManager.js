export class OutfitManager {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  savePreset(garments) {
    const data = {
      gender: this.stateManager.getState().gender,
      mode: this.stateManager.getState().mode,
      garments: garments
    };

    const json = JSON.stringify(data);
    localStorage.setItem("vp_outfit", json);

    return json;
  }

  loadPreset(callback) {
    const json = localStorage.getItem("vp_outfit");
    if (!json) return;

    const data = JSON.parse(json);
    callback(data);
  }

  generateShareURL(garments) {
    const encoded = btoa(JSON.stringify(garments));
    return `${window.location.origin}${window.location.pathname}?outfit=${encoded}`;
  }

  parseURL() {
    const params = new URLSearchParams(window.location.search);
    const data = params.get("outfit");
    if (!data) return null;

    return JSON.parse(atob(data));
  }
}
