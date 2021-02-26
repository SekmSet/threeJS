export default class Keyboard {
  constructor(game, player) {
    this.game = game;
    this.player = player;
  }

  controls() {
    let forward = 0;
    let turn = 0;

    if (this.game.keyStates["KeyW"] || this.game.keyStates["ArrowUp"]) {
      forward = 0.4;
    }

    if (
      (this.game.keyStates["KeyW"] && this.game.keyStates["ShiftLeft"]) ||
      (this.game.keyStates["ArrowUp"] && this.game.keyStates["ShiftLeft"])
    ) {
      forward = 0.7;
    }

    if (this.game.keyStates["KeyS" || this.game.keyStates["ArrowDown"]]) {
      forward = -0.4;
    }

    if (this.game.keyStates["KeyA"] || this.game.keyStates["ArrowLeft"]) {
      turn = -1;
    }

    if (this.game.keyStates["KeyD"] || this.game.keyStates["ArrowRight"]) {
      turn = 1;
    }

    if (this.game.keyStates["KeyK"]) {
      // if (this.player.action !== "Kneeling") {
      //   this.action = "Kneeling";
      // }
    }

    if (this.game.keyStates["KeyQ"]) {
      // this.action = "Boxing";
    }

    if (this.game.keyStates["Space"]) {
      // if (this.action !== "Jump") {
      //   this.action = "Jump";
      // }
      this.player.player.object.position.y = 100;
    }

    this.player.playerControl(forward, turn);
  }
}
