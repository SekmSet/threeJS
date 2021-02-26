import * as THREE from "three";

export default class Lights {
  constructor(game) {
    this.scene = game.scene;

    this.directionalLight();
    this.hemisphereLight();
  }

  directionalLight() {
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 200, 100);
    light.castSPointLighthadow = true;
    light.shadow.camera.top = 200;
    light.shadow.camera.bottom = 200;
    light.shadow.camera.left = 200;
    light.shadow.camera.right = 200;
    this.scene.add(light);
  }

  hemisphereLight() {
    let light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 200, 0);
    this.scene.add(light);
  }
}
