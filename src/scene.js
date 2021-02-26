import "./assets/style.css";

import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import UiStats from "./controllers/uiStats";
import Lights from "./controllers/lights";
import Player from "./controllers/models/caracters/main";
import Floor from "./controllers/models/floor";
import ThreeMagnolia from "./controllers/models/three";
import Temple from "./controllers/models/temple";
import Loader from "./controllers/loader";
import Skybox from "./controllers/skybox";

class Scene {
  constructor() {
    this.keyStates = {};
    this.scene = new THREE.Scene();
    this.manager = new THREE.LoadingManager();
    this.stats = new Stats();
    this.uiState = new UiStats();
    this.skybox = new Skybox(this);
    this.lights = new Lights(this);
    this.floor = new Floor(this);
    this.threeMagnolia = new ThreeMagnolia(this);
    this.temple = new Temple(this);
    this.player = new Player(this, [
      ...this.threeMagnolia.colliders(),
      ...this.temple.colliders(),
    ]);

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      5000
    );
    this.camera.rotation.order = "YXZ";

    // HELP : ajout des axes x, y, z (visualisation)
    this.axesHelper = new THREE.AxesHelper(500);

    new Loader(this);
    this.init();
    this.skybox.loadModel();
    this.floor.loadModel();
    this.threeMagnolia.loadModel();
    this.temple.loadModel();
    this.player.loadModel();
    this.addEventHandler();
    this.animate();
  }

  init() {
    this.scene.background = new THREE.Color(0xaec6cf);
    this.scene.add(this.axesHelper);

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

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  addEventHandler() {
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
      // Lock the cursor
      document.body.requestPointerLock();
    });

    document.body.addEventListener("mousemove", (event) => {
      if (document.pointerLockElement === document.body) {
        this.camera.rotation.y -= event.movementX / 500;
        this.camera.rotation.x -= event.movementY / 500;
      }
    });
  }

  animate() {
    this.player.animate();
    this.renderer.render(this.scene, this.camera);
    this.stats.update();
    requestAnimationFrame((t) => this.animate());
  }
}

export default Scene;
