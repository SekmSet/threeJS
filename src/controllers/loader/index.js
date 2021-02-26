import Music from "../music";

export default class Loader {
  constructor(game) {
    this.game = game;
    this.loadMusic();

    this.loadingPage();
  }

  loadMusic() {
    const music = new Music();
    music.loadMusic(this.game.camera);
  }

  loadingPage() {
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
        <b>Pour se battre</b> : touche A<br>
        <b>Pour afficher ses statistiques</b> : touche M
    `;
    progress.appendChild(progressBar);
    progress.appendChild(info);
    document.body.appendChild(progress);

    this.game.manager.onProgress = function (item, loaded, total) {
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
}
