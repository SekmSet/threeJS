import * as THREE from "three";

const progress = document.createElement("div");
const progressBar = document.createElement("div");

progress.appendChild(progressBar);

document.body.appendChild(progress);

const manager = new THREE.LoadingManager();
manager.onProgress = function (item, loaded, total) {
  progressBar.style.width = (loaded / total) * 100 + "%";
};

function addRandomPlaceHoldItImage() {
  const r = Math.round(Math.random() * 4000);
  new THREE.ImageLoader(manager).load("http://placehold.it/" + r + "x" + r);
}

for (let i = 0; i < 10; i++) addRandomPlaceHoldItImage();
