import Scene from "./scene";

const scene = new Scene();

document.getElementById("changeAnimation").addEventListener("click", () => {
  scene.toggleAnimation();
});

document.getElementById("kneeling").addEventListener("click", () => {
  scene.doAnAction("Kneeling");
});

console.log(scene);
