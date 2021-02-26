// import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
// import * as THREE from "three";
//
// loadJapanTemple() {
//     this.manager.setURLModifier((e) => {
//         const paths = e.split("/");
//         return "src/resources/japan-temple/" + paths.pop();
//     });
//
//     const loader = new FBXLoader(this.manager);
//     loader.load("temple_model3.fbx", (object) => {
//         object.position.set(100, 0, 100);
//         this.scene.add(object);
//
//         const tLoader = new THREE.TextureLoader();
//         const texture = tLoader.load(
//             `src/resources/japan-temple/textures/temple_model3_BaseColor.tga.png`
//         );
//
//         const textureAlpha = tLoader.load(
//             `src/resources/japan-temple/textures/temple_model3_AO.tga.png`
//         );
//
//         object.traverse(function (child) {
//             if (child.isMesh) {
//                 child.material.map = texture;
//                 child.castShadow = true;
//                 child.receiveShadow = true;
//             }
//         });
//     });
// }
