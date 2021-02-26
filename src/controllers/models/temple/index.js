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

  colliders() {
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: false,
      alphaTest: 0.05,
      opacity: 0,
      transparent: true,
    });

    const geometry = new THREE.BoxGeometry(300.5, 200, 385);
    const geometryTempleFront = new THREE.BoxGeometry(300.5, 75, 100);
    const geometryTempleBox = new THREE.BoxGeometry(95, 45, 60);
    const geometryTempleRock = new THREE.BoxGeometry(100, 50, 120);

    const temple = new THREE.Mesh(geometry, material);
    temple.position.set(-190.5, 100, 475);

    const frontTemple = new THREE.Mesh(geometryTempleFront, material);
    frontTemple.position.set(-190.5, 25, 700);

    const frontTempleBox = new THREE.Mesh(geometryTempleBox, material);
    frontTempleBox.position.set(-155, 90, 700);

    const frontTempleRock = new THREE.Mesh(geometryTempleRock, material);
    frontTempleRock.position.set(-265, 25, 795);

    return [temple, frontTemple, frontTempleBox, frontTempleRock];
  }
}
