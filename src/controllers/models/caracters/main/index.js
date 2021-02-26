import { TGALoader } from "three/examples/jsm/loaders/TGALoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as THREE from "three";
import JoyStick from "../../../../libs/Joystick";

export default class Player {
  constructor(game) {
    this.game = game;
    this.clock = new THREE.Clock();
    this.player = {};
    this.animations = {};
    this.anims = [
      "Walk",
      "Kneeling",
      "Run",
      "Left Turn",
      "Right Turn",
      "Walking Backwards",
      "Jump",
      "Boxing",
    ];
  }

  loadPlayerModel() {
    this.game.manager.setURLModifier((e) => {
      return e
        .replace("X:/job/BSG/char/psd/", "/src/resources/personnage/Nyra_TGAs/")
        .replace(" copy", "");
    });
    this.game.manager.addHandler(/\.tga$/i, new TGALoader(this.game.manager));
    const loader = new FBXLoader(this.game.manager);

    loader.load(`src/resources/personnage/annimation/Idle.fbx`, (object) => {
      object.mixer = new THREE.AnimationMixer(object);
      // size du personnage
      object.scale.set(7, 7, 1);
      this.player.mixer = object.mixer;
      this.player.root = object.mixer.getRoot();

      object.name = "Nyra_T-pose";

      object.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = false;
        }
      });

      this.player.object = new THREE.Object3D();

      this.game.scene.add(this.player.object);
      this.player.object.add(object);
      this.animations.Idle = object.animations[0];

      this.loadNextAnim(loader);
    });
  }

  loadNextAnim(loader) {
    let anim = this.anims.pop();
    loader.load(`src/resources/personnage/annimation/${anim}.fbx`, (object) => {
      this.animations[anim] = object.animations[0];
      if (this.anims.length > 0) {
        this.loadNextAnim(loader);
      } else {
        this.createCameras();
        this.createColliders();
        new JoyStick({
          onMove: this.playerControl,
          game: this,
        });
        delete this.anims;
        this.action = "Idle";
        this.animate();
      }
    });
  }

  createCameras() {
    const back = new THREE.Object3D();
    back.position.set(0, 300, -600);
    back.parent = this.player.object;

    this.player.cameras = { back };
    this.activeCamera = this.player.cameras.back;
  }

  set activeCamera(object) {
    this.player.cameras.active = object;
  }

  playerControl(forward, turn) {
    turn = -turn;

    if (forward > 0.3) {
      if (this.player.action !== "Walk" && this.player.action !== "Run") {
        this.action = "Walk";
      }
    } else if (forward < -0.3) {
      if (this.player.action !== "Walking Backwards") {
        this.action = "Walking Backwards";
      }
    } else {
      forward = 0;
      if (Math.abs(turn) > 0.1) {
        if (this.player.action !== "Walk") {
          this.action = "Walk";
        }
      } else if (this.player.action !== "Idle") {
        this.action = "Idle";
      }
    }

    if (forward === 0 && turn === 0) {
      delete this.player.move;
    } else {
      this.player.move = { forward, turn };
    }
  }

  set action(name) {
    const action = this.player.mixer.clipAction(this.animations[name]);
    action.time = 0;
    this.player.mixer.stopAllAction();
    this.player.action = name;
    this.player.actionTime = Date.now();
    this.player.actionName = name;
    action.fadeIn(0.5);
    action.play();
  }

  get action() {
    if (this.player === undefined || this.player.actionName === undefined) {
      return "";
    }
    return this.player.actionName;
  }

  createColliders() {
    const geometry = new THREE.BoxGeometry(300.5, 200, 385);
    const geometryMagnolia = new THREE.BoxGeometry(80, 100, 80);
    const geometryTempleFront = new THREE.BoxGeometry(300.5, 75, 100);
    const geometryTempleBox = new THREE.BoxGeometry(95, 45, 60);
    const geometryTempleRock = new THREE.BoxGeometry(100, 50, 120);

    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: false,
      alphaTest: 0.05,
      opacity: 0,
      transparent: true,
    });

    this.colliders = [];

    const temple = new THREE.Mesh(geometry, material);
    temple.position.set(-190.5, 100, 475);
    this.game.scene.add(temple);
    this.colliders.push(temple);

    const frontTemple = new THREE.Mesh(geometryTempleFront, material);
    frontTemple.position.set(-190.5, 25, 700);
    this.game.scene.add(frontTemple);
    this.colliders.push(frontTemple);

    const frontTempleBox = new THREE.Mesh(geometryTempleBox, material);
    frontTempleBox.position.set(-155, 90, 700);
    this.game.scene.add(frontTempleBox);
    this.colliders.push(frontTempleBox);

    const frontTempleRock = new THREE.Mesh(geometryTempleRock, material);
    frontTempleRock.position.set(-265, 25, 795);
    this.game.scene.add(frontTempleRock);
    this.colliders.push(frontTempleRock);

    const magnolia = new THREE.Mesh(geometryMagnolia, material);
    magnolia.position.set(100, 50, 0);
    this.game.scene.add(magnolia);
    this.colliders.push(magnolia);
  }

  controls() {
    let forward = 0;
    let turn = 0;

    if (this.game.keyStates["KeyW"] || this.game.keyStates["ArrowUp"]) {
      forward = 0.4;
    }

    if (
      (this.game.keyStates["KeyW"] && this.game.keyStates["ShiftLeft"]) ||
      (this.game.keyStates["ArrowUp"] && this.game.keyStates["ShiftLeft"])
    ) {
      forward = 0.7;
    }

    if (this.game.keyStates["KeyS" || this.game.keyStates["ArrowDown"]]) {
      forward = -0.4;
    }

    if (this.game.keyStates["KeyA"] || this.game.keyStates["ArrowLeft"]) {
      turn = -1;
    }

    if (this.game.keyStates["KeyD"] || this.game.keyStates["ArrowRight"]) {
      turn = 1;
    }

    if (this.game.keyStates["KeyK"]) {
      // if (this.player.action !== "Kneeling") {
      //   this.action = "Kneeling";
      // }
    }

    if (this.game.keyStates["KeyQ"]) {
      // this.action = "Boxing";
    }

    if (this.game.keyStates["Space"]) {
      // if (this.action !== "Jump") {
      //   this.action = "Jump";
      // }
      this.player.object.position.y = 100;
    }

    this.playerControl(forward, turn);
  }

  movePlayer(dt) {
    const pos = this.player.object.position.clone();
    pos.y += 60;
    let dir = new THREE.Vector3();
    this.player.object.getWorldDirection(dir);
    if (this.player.move.forward < 0) dir.negate();
    let raycaster = new THREE.Raycaster(pos, dir);
    let blocked = false;
    const colliders = this.colliders;

    if (colliders !== undefined) {
      const intersect = raycaster.intersectObjects(colliders);
      if (intersect.length > 0) {
        if (intersect[0].distance < 50) blocked = true;
      }
    }

    if (!blocked) {
      if (this.player.move.forward > 0) {
        const speed = this.player.action == "Run" ? 550 : 150;
        this.player.object.translateZ(dt * speed);
      } else {
        this.player.object.translateZ(-dt * 30);
      }
    }

    if (colliders !== undefined) {
      //cast left
      dir.set(-1, 0, 0);
      dir.applyMatrix4(this.player.object.matrix);
      dir.normalize();
      raycaster = new THREE.Raycaster(pos, dir);

      let intersect = raycaster.intersectObjects(colliders);
      if (intersect.length > 0) {
        if (intersect[0].distance < 50)
          this.player.object.translateX(100 - intersect[0].distance);
      }

      //cast right
      dir.set(1, 0, 0);
      dir.applyMatrix4(this.player.object.matrix);
      dir.normalize();
      raycaster = new THREE.Raycaster(pos, dir);

      intersect = raycaster.intersectObjects(colliders);
      if (intersect.length > 0) {
        if (intersect[0].distance < 50)
          this.player.object.translateX(intersect[0].distance - 100);
      }

      //cast down
      dir.set(0, -1, 0);
      pos.y += 200;
      raycaster = new THREE.Raycaster(pos, dir);
      const gravity = 10;

      intersect = raycaster.intersectObjects(colliders);
      if (intersect.length > 0) {
        const targetY = pos.y - intersect[0].distance;
        if (targetY > this.player.object.position.y) {
          //Going up
          this.player.object.position.y =
            0.8 * this.player.object.position.y + 0.2 * targetY;
          this.player.velocityY = 0;
        } else if (targetY < this.player.object.position.y) {
          //Falling
          if (this.player.velocityY == undefined) this.player.velocityY = 0;
          this.player.velocityY += dt * gravity;
          this.player.object.position.y -= this.player.velocityY;
          if (this.player.object.position.y < targetY) {
            this.player.velocityY = 0;
            this.player.object.position.y = targetY;
          }
        }
      } else if (this.player.object.position.y > 0) {
        if (this.player.velocityY == undefined) this.player.velocityY = 0;
        this.player.velocityY += dt * gravity;
        this.player.object.position.y -= this.player.velocityY;
        if (this.player.object.position.y < 0) {
          this.player.velocityY = 0;
          this.player.object.position.y = 0;
        }
      }
    }

    this.player.object.rotateY(this.player.move.turn * dt);
  }

  animate() {
    const dt = this.clock.getDelta();

    if (this.player.mixer !== undefined) {
      this.player.mixer.update(dt);

      if (document.pointerLockElement) {
        this.controls();
      }
    }

    if (this.player.action === "Walk") {
      if (this.player.move.forward > 0.6) {
        if (this.action !== "Run") {
          this.action = "Run";
        }
      } else {
        if (this.action !== "Walk") {
          this.action = "Walk";
        }
      }
    }

    if (this.player.move !== undefined) {
      this.movePlayer(dt);
    }

    if (
      this.player.cameras !== undefined &&
      this.player.cameras.active !== undefined
    ) {
      this.game.camera.position.lerp(
        this.player.cameras.active.getWorldPosition(new THREE.Vector3()),
        0.05
      );
      const pos = this.player.object.position.clone();
      pos.y += 100;
      this.game.camera.lookAt(pos);
    }
  }
}
