import * as THREE from "three";

export default class Skybox {
  constructor(game) {
    this.game = game;
  }

  loadModel() {
    const geometry = new THREE.CubeGeometry(5000, 5000, 5000);
    const cubeMaterials = [
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("nightsky_ft.png"),
        side: THREE.DoubleSide,
      }), //front side
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("nightsky_bk.png"),
        side: THREE.DoubleSide,
      }), //back side
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("nightsky_up.png"),
        side: THREE.DoubleSide,
      }), //up side
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("nightsky_dn.png"),
        side: THREE.DoubleSide,
      }), //down side
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("nightsky_rt.png"),
        side: THREE.DoubleSide,
      }), //right side
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("nightsky_lf.png"),
        side: THREE.DoubleSide,
      }), //left side
    ];

    const cubeMaterial = new THREE.MeshFaceMaterial(cubeMaterials);
    const cube = new THREE.Mesh(geometry, cubeMaterial);
    this.game.scene.add(cube);
  }
}
