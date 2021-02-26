export default class UiStats {
  constructor() {
    this.ui = document.querySelector("#ui");
  }

  show(keyStates) {
    if (keyStates["Semicolon"]) {
      this.ui.style.display = "block";
    }
  }

  hide(keyStates) {
    if (!keyStates["Semicolon"]) {
      this.ui.style.display = "none";
    }
  }
}
