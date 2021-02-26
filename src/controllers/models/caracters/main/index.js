// import {TGALoader} from "three/examples/jsm/loaders/TGALoader";
// import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
// import * as THREE from "three";
//
// loadPlayerModel() {
//     const game = this;
//
//     this.manager.setURLModifier((e) => {
//         return e
//             .replace("X:/job/BSG/char/psd/", "/src/resources/personnage/Nyra_TGAs/")
//             .replace(" copy", "");
//     });
//     this.manager.addHandler(/\.tga$/i, new TGALoader(this.manager));
//     const loader = new FBXLoader(this.manager);
//
//     loader.load(
//         `src/resources/personnage/annimation/Idle.fbx`,
//         function (object) {
//             object.mixer = new THREE.AnimationMixer(object);
//             // size du personnage
//             object.scale.set(7, 7, 1);
//             game.player.mixer = object.mixer;
//             game.player.root = object.mixer.getRoot();
//
//             object.name = "Nyra_T-pose";
//
//             object.traverse(function (child) {
//                 if (child.isMesh) {
//                     child.castShadow = true;
//                     // child.scale.set(10, 12, 12);
//                     child.receiveShadow = false;
//                 }
//             });
//
//             game.player.object = new THREE.Object3D();
//             // game.player.object.scale.set(0.35, 0.35, 0.35);
//
//             game.scene.add(game.player.object);
//             game.player.object.add(object);
//             game.animations.Idle = object.animations[0];
//
//             // game.loadNextAnim(loader);
//
//             // game.player.mixer.clipAction(object.animations[0]).play();
//             // game.animate();
//         }
//     );
// }
