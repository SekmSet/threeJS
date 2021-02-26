import * as THREE from "three";

export default class Floor {
  constructor(game) {
    this.game = game;
  }

  loadModel() {
    let floor_geometry = new THREE.PlaneBufferGeometry(5000, 5000, 60, 60);
    floor_geometry.rotateX(-Math.PI / 2);
    floor_geometry = floor_geometry.toNonIndexed();

    const floor_texture = new THREE.TextureLoader().load("grass.png");
    const floor_material = new THREE.MeshPhongMaterial({ map: floor_texture });
    let floor = new THREE.Mesh(floor_geometry, floor_material);
    floor.castShadow = false;
    floor.receiveShadow = true;
    this.game.scene.add(floor);
  }
}
