import "./assets/style.css";

import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { TGALoader } from "three/examples/jsm/loaders/TGALoader";
import JoyStick from "./libs/Joystick";
import Stats from "three/examples/jsm/libs/stats.module";
import UiStats from "./controllers/uiStats";
import Music from "./controllers/music";

class Scene {
  constructor() {
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
    this.keyStates = {};

    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.manager = new THREE.LoadingManager();
    this.stats = new Stats();
    this.uiState = new UiStats();
    this.music = new Music();

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      5000
    );
    this.camera.rotation.order = "YXZ";

    // HELP : ajout des axes x, y, z (visualisation)
    this.axesHelper = new THREE.AxesHelper(500);

    this.loader();
    this.music.loadMusic(this.camera);
    this.init();
    this.skybox();
    // this.tmpFloor();
    this.grassFloor();
    this.loadThreeMagnolia();
    this.loadJapanTemple();
    this.loadPlayerModel();
    this.AddEventHandler();
    this.animate();
  }

  AddEventHandler() {
    document.addEventListener("keydown", (event) => {
      this.keyStates[event.code] = true;

      // show ui
      this.uiState.show(this.keyStates);
    });

    document.addEventListener("keyup", (event) => {
      this.keyStates[event.code] = false;

      // hide ui
      this.uiState.hide(this.keyStates);
    });

    document.addEventListener("mousedown", () => {
      document.body.requestPointerLock();
    });

    document.body.addEventListener("mousemove", (event) => {
      if (document.pointerLockElement === document.body) {
        this.camera.rotation.y -= event.movementX / 500;
        this.camera.rotation.x -= event.movementY / 500;
      }
    });
  }

  loader() {
    const progress = document.createElement("div");
    progress.className = "progress";

    const progressBar = document.createElement("div");
    progressBar.className = "progressBar";

    const info = document.createElement("div");
    info.className = "info";
    info.innerHTML = `<br>
        <b>Avec le joystick : </b> avancer, droite, gauche, reculer <hr>
        <b>Avec le clavier :</b> avancer <i>(Z ou flèche du haut)</i>, droite <i>(D ou flèche de droite)</i>, gauche <i>(Q ou flèche de gauche)</i>, reculer <i>(S ou flèche du bas)</i><br>
        <b>Pour sauter</b> : touche ESPACE <br>
        <b>Pour quitter le mode</b> ESC <br>
        <b>Pour courrir</b> : touche avancer + Maj gauche<br>
        <b>Pour s'accroupir</b> : touche K<br>
        <b>Pour se battre</b> : touche A`;
    progress.appendChild(progressBar);
    progress.appendChild(info);
    document.body.appendChild(progress);

    this.manager.onProgress = function (item, loaded, total) {
      const canvas = document.querySelector("canvas");
      canvas.style.display = "none";

      const current = (loaded / total) * 100;
      progressBar.innerText = Math.round(current) + "%";

      if (current === 100) {
        canvas.style.display = "block";
        progress.style.display = "none";
      }

      progressBar.style.width = current + "%";
    };
  }

  loadMusic() {
    const number = Math.floor(Math.random() * Math.floor(5)) + 1;
    this.audioLoader.load(`/sounds/sound-${number}.ogg`, (buffer) => {
      this.sound.setBuffer(buffer);
      this.sound.setLoop(true);
      this.sound.setVolume(0.5);
      this.sound.play();
    });

    this.camera.add(this.listener);

    document.documentElement.addEventListener("mousedown", () => {
      if (!this.sound) {
        this.sound.resume();
      }
    });
  }

  init() {
    this.scene.background = new THREE.Color(0xaec6cf);
    this.scene.add(this.axesHelper);

    this.HemisphereLight();
    this.DirectionalLight();

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    document.body.appendChild(this.renderer.domElement);
    document.body.appendChild(this.stats.dom);

    window.addEventListener(
      "resize",
      () => {
        this.onWindowResize();
      },
      false
    );
  }

  skybox() {
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
    this.scene.add(cube);
  }

  DirectionalLight() {
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 200, 100);
    light.castSPointLighthadow = true;
    light.shadow.camera.top = 200;
    light.shadow.camera.bottom = 200;
    light.shadow.camera.left = 200;
    light.shadow.camera.right = 200;
    this.sun = light;
    this.scene.add(light);
  }

  HemisphereLight() {
    let light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 200, 0);
    this.scene.add(light);
  }

  loadThreeMagnolia() {
    this.manager.setURLModifier((e) => {
      const paths = e.split("/");
      return "src/resources/arbre/" + paths.pop();
    });

    const loader = new FBXLoader(this.manager);
    loader.load("BCY_JA11_MagnoliaSoulangeana_5.fbx", (object) => {
      this.scene.add(object);

      const tLoader = new THREE.TextureLoader();
      object.position.x = 100;

      const petal01 = tLoader.load(
        `src/resources/arbre/textures/JA11_Petal01Back_dif_su.png`
      );

      const petal02 = tLoader.load(
        `src/resources/arbre/textures/JA11_Petal02Back_dif_su.png`
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
    });
  }

  loadJapanTemple() {
    this.manager.setURLModifier((e) => {
      const paths = e.split("/");
      return "src/resources/japan-temple/" + paths.pop();
    });

    const loader = new FBXLoader(this.manager);
    loader.load("temple_model3.fbx", (object) => {
      object.position.set(100, 0, 100);
      this.scene.add(object);

      const tLoader = new THREE.TextureLoader();
      const texture = tLoader.load(
        `src/resources/japan-temple/textures/temple_model3_BaseColor.tga.png`
      );

      const textureAlpha = tLoader.load(
        `src/resources/japan-temple/textures/temple_model3_AO.tga.png`
      );

      object.traverse(function (child) {
        if (child.isMesh) {
          child.material.map = texture;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    });
  }

  tmpFloor() {
    let mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(5000, 5000),
      new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    mesh.material.transparent = true;
    this.scene.add(mesh);

    let grid = new THREE.GridHelper(2000, 40, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
  }

  grassFloor() {
    //Declaring the floor
    let floor_geometry = new THREE.PlaneBufferGeometry(5000, 5000, 60, 60);
    floor_geometry.rotateX(-Math.PI / 2);
    floor_geometry = floor_geometry.toNonIndexed();

    const floor_texture = new THREE.TextureLoader().load("grass.png");
    const floor_material = new THREE.MeshPhongMaterial({ map: floor_texture });
    let floor = new THREE.Mesh(floor_geometry, floor_material);
    floor.castShadow = false;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  loadPlayerModel() {
    const game = this;

    this.manager.setURLModifier((e) => {
      return e
        .replace("X:/job/BSG/char/psd/", "/src/resources/personnage/Nyra_TGAs/")
        .replace(" copy", "");
    });
    this.manager.addHandler(/\.tga$/i, new TGALoader(this.manager));
    const loader = new FBXLoader(this.manager);

    loader.load(
      `src/resources/personnage/annimation/Idle.fbx`,
      function (object) {
        object.mixer = new THREE.AnimationMixer(object);
        // size du personnage
        object.scale.set(7, 7, 1);
        game.player.mixer = object.mixer;
        game.player.root = object.mixer.getRoot();

        object.name = "Nyra_T-pose";

        object.traverse(function (child) {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = false;
          }
        });

        game.player.object = new THREE.Object3D();

        game.scene.add(game.player.object);
        game.player.object.add(object);
        game.animations.Idle = object.animations[0];

        game.loadNextAnim(loader);
      }
    );
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

  loadNextAnim(loader) {
    let anim = this.anims.pop();
    const game = this;
    loader.load(`src/resources/personnage/annimation/${anim}.fbx`, (object) => {
      game.animations[anim] = object.animations[0];
      if (game.anims.length > 0) {
        game.loadNextAnim(loader);
      } else {
        game.createCameras();
        game.createColliders();
        game.joystick = new JoyStick({
          onMove: game.playerControl,
          game: game,
        });
        delete game.anims;
        game.action = "Idle";
        game.animate();
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

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
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
    this.scene.add(temple);
    this.colliders.push(temple);

    const frontTemple = new THREE.Mesh(geometryTempleFront, material);
    frontTemple.position.set(-190.5, 25, 700);
    this.scene.add(frontTemple);
    this.colliders.push(frontTemple);

    const frontTempleBox = new THREE.Mesh(geometryTempleBox, material);
    frontTempleBox.position.set(-155, 90, 700);
    this.scene.add(frontTempleBox);
    this.colliders.push(frontTempleBox);

    const frontTempleRock = new THREE.Mesh(geometryTempleRock, material);
    frontTempleRock.position.set(-265, 25, 795);
    this.scene.add(frontTempleRock);
    this.colliders.push(frontTempleRock);

    const magnolia = new THREE.Mesh(geometryMagnolia, material);
    magnolia.position.set(100, 50, 0);
    this.scene.add(magnolia);
    this.colliders.push(magnolia);
  }

  controls() {
    let forward = 0;
    let turn = 0;

    if (this.keyStates["KeyW"] || this.keyStates["ArrowUp"]) {
      forward = 0.4;
    }

    if (
      (this.keyStates["KeyW"] && this.keyStates["ShiftLeft"]) ||
      (this.keyStates["ArrowUp"] && this.keyStates["ShiftLeft"])
    ) {
      forward = 0.7;
    }

    if (this.keyStates["KeyS" || this.keyStates["ArrowDown"]]) {
      forward = -0.4;
    }

    if (this.keyStates["KeyA"] || this.keyStates["ArrowLeft"]) {
      turn = -1;
    }

    if (this.keyStates["KeyD"] || this.keyStates["ArrowRight"]) {
      turn = 1;
    }

    if (this.keyStates["KeyK"]) {
      // if (this.player.action !== "Kneeling") {
      //   this.action = "Kneeling";
      // }
    }

    if (this.keyStates["KeyQ"]) {
      // this.action = "Boxing";
    }

    if (this.keyStates["Space"]) {
      // if (this.action !== "Jump") {
      //   this.action = "Jump";
      // }
      this.player.object.position.y = 100;
    }

    this.playerControl(forward, turn);
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
      this.camera.position.lerp(
        this.player.cameras.active.getWorldPosition(new THREE.Vector3()),
        0.05
      );
      const pos = this.player.object.position.clone();
      pos.y += 100;
      this.camera.lookAt(pos);
    }

    if (this.sun !== undefined && this.player.object !== undefined) {
      this.sun.position.x = this.player.object.position.x;
      this.sun.position.y = this.player.object.position.y + 200;
      this.sun.position.z = this.player.object.position.z + 100;
      this.sun.target = this.player.object;
    }

    this.renderer.render(this.scene, this.camera);
    this.stats.update();
    requestAnimationFrame((t) => this.animate());
  }
}

export default Scene;
