import "./assets/style.css";

import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { TGALoader } from "three/examples/jsm/loaders/TGALoader";
import JoyStick from "./libs/Joystick";

const progress = document.createElement("div");
progress.className = "progress";

const progressBar = document.createElement("div");
progressBar.className = "progressBar";

progress.appendChild(progressBar);
document.body.appendChild(progress);

class Scene {
  loader() {
    this.manager.onProgress = function (item, loaded, total) {
      const canvas = document.querySelector("canvas");
      const progress = document.querySelector(".progress");
      const progressBar = document.querySelector(".progressBar");

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
    ];
    this.clock = new THREE.Clock();

    this.manager = new THREE.LoadingManager();

    this.init();
    this.loader();

    this.tmpFloor();
    // this.grassFloor();
    this.loadThreeMagnolia();
    this.loadJapanTemple();
    this.loadPlayerModel();

    this.animate();
  }

  init() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      5000
    );

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xaec6cf);
    this.scene.fog = new THREE.Fog(0xaec6cf, 200, 1000);

    this.HemisphereLight();
    this.DirectionalLight();

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);

    window.addEventListener(
      "resize",
      () => {
        this.onWindowResize();
      },
      false
    );
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
      new THREE.PlaneBufferGeometry(2000, 2000),
      new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
    );
    mesh.rotation.x = -Math.PI / 2;
    // mesh.position.y = 5;
    mesh.receiveShadow = true;
    mesh.material.transparent = true;
    this.scene.add(mesh);

    let grid = new THREE.GridHelper(2000, 40, 0x000000, 0x000000);
    //grid.position.y = -100;
    grid.material.opacity = 0.2;
    // grid.position.y = 5;
    grid.material.transparent = true;
    this.scene.add(grid);
  }

  grassFloor() {
    const planeSize = 500;
    const loader = new THREE.TextureLoader();
    const texture = loader.load("src/resources/grass/grass_low_poly.obj");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -0.5;
    this.scene.add(mesh);
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
            // child.scale.set(10, 12, 12);
            child.receiveShadow = false;
          }
        });

        game.player.object = new THREE.Object3D();
        // game.player.object.scale.set(0.35, 0.35, 0.35);

        game.scene.add(game.player.object);
        game.player.object.add(object);
        game.animations.Idle = object.animations[0];

        game.loadNextAnim(loader);

        // game.player.mixer.clipAction(object.animations[0]).play();
        // game.animate();
      }
    );
  }

  movePlayer(dt) {
    if (this.player.move.forward > 0) {
      const speed = this.player.action === "Run" ? 350 : 150;
      this.player.object.translateZ(dt * speed);
    } else {
      this.player.object.translateZ(-dt * 30);
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
        // game.createColliders()
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

  animate() {
    const dt = this.clock.getDelta();
    requestAnimationFrame((t) => {
      this.animate();
    });

    if (this.player.mixer !== undefined) {
      this.player.mixer.update(dt);
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
  }
}

export default Scene;
