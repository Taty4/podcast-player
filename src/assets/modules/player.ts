import { createElement } from "./search-page";

class Player {
  app;
  player;
  audio;
  btn;

  constructor() {
    this.player = createElement("div", { className: "player" });
    this.app = document.querySelector<HTMLDivElement>(".app");
    this.btn = createElement("button", { className: "player-play" });
    this.btn.disabled = true;
    this.audio = new Audio();
    if (this.app) {
      this.app.append(this.player);
    }
    this.createPlayer();
  }

  createPlayer() {
    console.log("player");
    const inputPlayer = createElement("input", { className: "player-input" });
    inputPlayer.name = "player";
    inputPlayer.type = "range";
    inputPlayer.max = "100";
    inputPlayer.min = "0";
    inputPlayer.step = "1";

    const playerTime = createElement("p", {
      className: "player-time",
      text: "00:00 / 00:00",
    });

    this.btn.addEventListener("click", () => {
      if (this.audio.paused) {
        this.audio.play();
        this.btn.textContent = "Пауза";
      } else {
        this.audio.pause();
        this.btn.textContent = "Играть";
      }
    });

    this.player.append(this.btn, inputPlayer, playerTime);
  }

  play(url: string) {
    this.player.classList.add("visible");
    this.btn.disabled = false;
    this.audio.src = url;
    this.audio.load();
    this.audio.play();
  }
}

export const player = new Player();
