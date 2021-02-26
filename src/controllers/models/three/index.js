import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

export default class ThreeMagnolia {
  constructor(game) {
    this.game = game;
  }

  loadModel() {
    this.game.manager.setURLModifier((e) => {
      const paths = e.split("/");
      return "src/resources/arbre/" + paths.pop();
    });
    const loader = new FBXLoader(this.game.manager);
    loader.load("BCY_JA11_MagnoliaSoulangeana_5.fbx", (object) => {
      const tLoader = new THREE.TextureLoader();
      object.position.x = 100;

      const petal01 = tLoader.load(
        `src/resources/arbre/textures/JA11_Petal01Back_dif_su.png`
      );

      const petal03 = tLoader.load(
        `src/resources/arbre/textures/JA11_Petal03Back_dif_su.png`
      );

      object.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }

        if (child.name === "Petal01_5") {
          child.material.map = petal01;
        }

        if (child.name === "Petal03_5") {
          child.material.map = petal03;
        }
      });
      this.game.scene.add(object);
    });
  }

  colliders() {
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: false,
      alphaTest: 0.05,
      opacity: 0,
      transparent: true,
    });

    const geometryMagnolia = new THREE.BoxGeometry(80, 100, 80);

    const magnolia = new THREE.Mesh(geometryMagnolia, material);
    magnolia.position.set(100, 50, 0);

    return [magnolia];
  }
}
