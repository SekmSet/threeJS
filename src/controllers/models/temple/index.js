import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

export default class Temple {
  constructor(game) {
    this.game = game;
  }

  loadModel() {
    this.game.manager.setURLModifier((e) => {
      const paths = e.split("/");
      return "src/resources/japan-temple/" + paths.pop();
    });

    const loader = new FBXLoader(this.game.manager);
    loader.load("temple_model3.fbx", (object) => {
      object.position.set(100, 0, 100);

      const tLoader = new THREE.TextureLoader();
      const texture = tLoader.load(
        `src/resources/japan-temple/textures/temple_model3_BaseColor.tga.png`
      );

      object.traverse(function (child) {
        if (child.isMesh) {
          child.material.map = texture;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      this.game.scene.add(object);
    });
  }
}
