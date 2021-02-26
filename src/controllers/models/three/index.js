// import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
// import * as THREE from "three";
//
// loadThreeMagnolia() {
//     this.manager.setURLModifier((e) => {
//         const paths = e.split("/");
//         return "src/resources/arbre/" + paths.pop();
//     });
//
//     const loader = new FBXLoader(this.manager);
//     loader.load("BCY_JA11_MagnoliaSoulangeana_5.fbx", (object) => {
//         this.scene.add(object);
//
//         const tLoader = new THREE.TextureLoader();
//         object.position.x = 100;
//
//         const petal01 = tLoader.load(
//             `src/resources/arbre/textures/JA11_Petal01Back_dif_su.png`
//         );
//
//         const petal02 = tLoader.load(
//             `src/resources/arbre/textures/JA11_Petal02Back_dif_su.png`
//         );
//
//         const petal03 = tLoader.load(
//             `src/resources/arbre/textures/JA11_Petal03Back_dif_su.png`
//         );
//
//         object.traverse(function (child) {
//             if (child.isMesh) {
//                 child.castShadow = true;
//                 child.receiveShadow = true;
//             }
//
//             if (child.name === "Petal01_5") {
//                 child.material.map = petal01;
//             }
//
//             if (child.name === "Petal03_5") {
//                 child.material.map = petal03;
//             }
//         });
//     });
// }
