// import * as THREE from "three";
//
// tmpFloor() {
//     let mesh = new THREE.Mesh(
//         new THREE.PlaneBufferGeometry(2000, 2000),
//         new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
//     );
//     mesh.rotation.x = -Math.PI / 2;
//     // mesh.position.y = 5;
//     mesh.receiveShadow = true;
//     mesh.material.transparent = true;
//     this.scene.add(mesh);
//
//     let grid = new THREE.GridHelper(2000, 40, 0x000000, 0x000000);
//     //grid.position.y = -100;
//     grid.material.opacity = 0.2;
//     // grid.position.y = 5;
//     grid.material.transparent = true;
//     // this.scene.add(grid);
// }
//
// grassFloor() {
//     const planeSize = 500;
//     const loader = new THREE.TextureLoader();
//     const texture = loader.load("src/resources/grass/grass_low_poly.obj");
//     texture.wrapS = THREE.RepeatWrapping;
//     texture.wrapT = THREE.RepeatWrapping;
//
//     texture.magFilter = THREE.NearestFilter;
//     const repeats = planeSize / 2;
//     texture.repeat.set(repeats, repeats);
//
//     const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
//     const planeMat = new THREE.MeshPhongMaterial({
//         map: texture,
//         side: THREE.DoubleSide,
//     });
//     const mesh = new THREE.Mesh(planeGeo, planeMat);
//     mesh.rotation.x = Math.PI * -0.5;
//     this.scene.add(mesh);
// }
