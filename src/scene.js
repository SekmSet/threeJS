import "./assets/style.css";

import * as THREE from "three";
import { LoadingManager } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { TGALoader } from "three/examples/jsm/loaders/TGALoader";

class Scene {
  constructor() {
    this.clock = new THREE.Clock();
    this.player = {};
    this.animations = {};
    this.anims = ["Walk", "Kneeling"];

    this.init();

    this.tmpFloor();
    // this.grassFloor();
    this.threeMagnolia();
    this.japanTemple();
    this.model();

    this.animate();
  }

  init() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.renderer.shadowMap.enabled = true;
    this.renderer.setPixelRatio(window.devicePixelRatio);

    document.body.appendChild(this.renderer.domElement);

    const fov = 85;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(112, 100, 400);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xaec6cf);

    this.scene.fog = new THREE.Fog(0xaec6cf, 200, 1000);

    this.HemisphereLight();
    this.OrbitControls();
    this.DirectionalLight();
    // this.PointLight();
  }

  OrbitControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 5, 0);
    this.controls.update();
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
    light.castShadow = true;
    light.shadow.camera.top = 180;
    light.shadow.camera.bottom = -100;
    light.shadow.camera.left = -120;
    light.shadow.camera.right = 120;
    this.scene.add(light);
  }

  PointLight() {
    const light = new THREE.PointLight(0xc4c4c4, 0.3);
    light.position.set(0, 300, 500);
    this.scene.add(light);
  }

  HemisphereLight() {
    let light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 200, 0);
    this.scene.add(light);
  }

  AmbientLight() {
    let light = new THREE.AmbientLight(0x404040, 100);
    this.scene.add(light);
  }

  threeMagnoliaOld() {
    const loader = new OBJLoader();
    loader.load(
      "src/resources/arbre/OBJ_JA11_MagnoliaXSoulangeana_5.obj",
      (object) => {
        this.scene.add(object);
      }
    );
  }

  threeMagnolia() {
    const manager = new THREE.LoadingManager();

    manager.setURLModifier((e) => {
      const paths = e.split("/");
      return "src/resources/arbre/" + paths.pop();
    });

    const loader = new FBXLoader(manager);
    loader.load("BCY_JA11_MagnoliaSoulangeana_5.fbx", (object) => {
      this.scene.add(object);

      const tLoader = new THREE.TextureLoader();

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

  japanTemple() {
    const manager = new THREE.LoadingManager();

    manager.setURLModifier((e) => {
      const paths = e.split("/");
      return "src/resources/japan-temple/" + paths.pop();
    });

    const loader = new FBXLoader(manager);
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
        console.log(child);
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
    mesh.position.y = 5;
    mesh.receiveShadow = true;
    mesh.material.transparent = true;

    this.scene.add(mesh);

    let grid = new THREE.GridHelper(2000, 40, 0x000000, 0x000000);
    //grid.position.y = -100;
    grid.material.opacity = 0.2;
    grid.position.y = 5;

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

  model() {
    const game = this;

    const manager = new LoadingManager(); // add handler for TGA textures
    manager.setURLModifier((e) => {
      return e
        .replace("X:/job/BSG/char/psd/", "/src/resources/personnage/Nyra_TGAs/")
        .replace(" copy", "");
    });
    manager.addHandler(/\.tga$/i, new TGALoader(manager));
    const loader = new FBXLoader(manager);

    loader.load(
      `src/resources/personnage/annimation/Idle.fbx`,
      function (object) {
        object.mixer = new THREE.AnimationMixer(object);
        game.player.mixer = object.mixer;
        game.player.root = object.mixer.getRoot();

        object.position.x = 100;
        object.position.y = 6;
        object.name = "Nyra_T-pose";

        object.traverse(function (child) {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = false;
          }
        });

        game.scene.add(object);
        game.player.object = object;
        game.animations.Idle = object.animations[0];
        game.loadNextAnim(loader);

        // game.player.mixer.clipAction(object.animations[0]).play();
        // game.animate();
      }
    );
  }

  loadNextAnim(loader) {
    let anim = this.anims.pop();
    const game = this;
    loader.load(`src/resources/personnage/annimation/${anim}.fbx`, (object) => {
      game.animations[anim] = object.animations[0];
      if (game.anims.length > 0) {
        game.loadNextAnim(loader);
      } else {
        delete game.anims;
        game.action = "Idle";
        game.animate();
      }
    });
  }

  toggleAnimation() {
    if (this.action === "Idle") {
      this.action = "Walk";
    } else {
      this.action = "Idle";
    }
  }

  doAnAction(action) {
    if (this.action === "Idle") {
      this.action = action;
    } else {
      this.action = "Idle";
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

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame((t) => {
      const dt = this.clock.getDelta();
      this.animate();
      this.controls.update();
      if (this.player.mixer !== undefined) this.player.mixer.update(dt);
      this.renderer.render(this.scene, this.camera);
    });
  }
}

export default Scene;
