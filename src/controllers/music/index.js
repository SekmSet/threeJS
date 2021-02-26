import * as THREE from "three";

export default class Music {
  constructor() {
    this.listener = new THREE.AudioListener();
    this.sound = new THREE.Audio(this.listener);
    this.audioLoader = new THREE.AudioLoader();
  }

  loadMusic(camera) {
    const number = Math.floor(Math.random() * Math.floor(5)) + 1;
    this.audioLoader.load(`/sounds/sound-${number}.ogg`, (buffer) => {
      this.sound.setBuffer(buffer);
      this.sound.setLoop(true);
      this.sound.setVolume(0.5);
      this.sound.play();
    });

    camera.add(this.listener);

    document.documentElement.addEventListener("mousedown", () => {
      if (!this.sound) {
        this.sound.resume();
      }
    });
  }
}
