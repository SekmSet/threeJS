import "./assets/style.css";

import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { TGALoader } from "three/examples/jsm/loaders/TGALoader";
import JoyStick from "./libs/Joystick";
import Stats from "three/examples/jsm/libs/stats.module";

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

    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.manager = new THREE.LoadingManager();
    this.listener = new THREE.AudioListener();
    this.sound = new THREE.Audio(this.listener);
    this.audioLoader = new THREE.AudioLoader();
    this.stats = new Stats();

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      5000
    );

    // ajout des axes x, y, z (visualisation)
    this.axesHelper = new THREE.AxesHelper(500);

    this.loader();
    this.loadMusic();
    this.init();

    this.tmpFloor();
    // this.grassFloor();
    this.loadThreeMagnolia();
    this.loadJapanTemple();
    this.loadPlayerModel();

    // document.addEventListener("keyup", function (event) {
    //   if (event.defaultPrevented) {
    //     return;
    //   }
    //
    //   var key = event.key || event.keyCode;
    //
    //   if (key === 'Escape' || key === 'Esc' || key === 27) {
    //     doWhateverYouWantNowThatYourKeyWasHit();
    //   }
    // });

    this.animate();
  }

  loader() {
    const progress = document.createElement("div");
    progress.className = "progress";

    const progressBar = document.createElement("div");
    progressBar.className = "progressBar";

    progress.appendChild(progressBar);
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
      this.sound.resume();
    });
  }

  init() {
    this.scene.background = new THREE.Color(0xaec6cf);
    // this.scene.fog = new THREE.Fog(0xaec6cf, 200, 1000);
    this.scene.add(this.axesHelper);

    this.HemisphereLight();
    this.DirectionalLight();

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
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
    // this.scene.add(grid);
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
      const gravity = 30;

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

    // object.onkeypress = function(){myScript};

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

  setupKeyControls() {
    document.onkeydown = function (e) {
      switch (e.key) {
        case 32:
          cube.rotation.x += 0.1;
          break;
      }
    };
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

    this.stats.update();

    this.renderer.render(this.scene, this.camera);
  }
}

export default Scene;
