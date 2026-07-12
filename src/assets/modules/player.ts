import { createElement } from "./search-page";
import type { Episode } from "./search-page";
import { router } from "./router";
import { saveEpisodeProgress, getEpisodeProgress } from "./episodes-progress";

class Player {
  audio;
  private elements;
  private player: HTMLElement;
  private nameEpisode: HTMLElement;
  private btnPlayer: HTMLElement;
  private btnGoToPodacst: HTMLElement;
  private currentEpisode;
  private currentTimeEl: HTMLElement;
  private inputEl: HTMLInputElement;
  private durationEl: HTMLElement;
  private lastSave = 0;

  constructor() {
    this.audio = new Audio();
    this.elements = createUIPlayer();
    this.currentEpisode = this.elements.lastEpisode;
    if (this.currentEpisode) this.audio.src = this.currentEpisode?.enclosureUrl;
    this.player = this.elements.player;
    this.nameEpisode = this.elements.nameEpisode;
    this.btnPlayer = this.elements.playerBTN;
    this.btnGoToPodacst = this.elements.btnGoToPdcast;
    this.currentTimeEl = this.elements.currentTime;
    this.inputEl = this.elements.inputPlayer;
    this.durationEl = this.elements.duration;

    this.addListeners();
  }

  addListeners() {
    this.btnPlayer.addEventListener("click", () => {
      this.toogleCurrent();
    });

    this.btnGoToPodacst.addEventListener("click", () => {
      this.goToPodcast();
    });

    this.audio.addEventListener("timeupdate", () => {
      this.updateProgress();

      if (!this.currentEpisode) return;

      const now = Date.now();

      if (now - this.lastSave < 1000) return;

      this.lastSave = now;

      this.saveLastEpisode();
      saveEpisodeProgress(this.currentEpisode.id, this.audio.currentTime);
    });

    this.audio.addEventListener("loadedmetadata", () => {
      const progress = getEpisodeProgress();
      const savedTime = progress[this.currentEpisode.id];
      if (savedTime !== undefined) {
        this.audio.currentTime = Math.max(savedTime - 10, 0);
      }
      this.updateProgress();
      this.updateDuration();
    });

    this.inputEl.addEventListener("input", () => {
      this.audio.currentTime = Number(this.inputEl.value);
    });
  }

  toggleEpisode(episode: Episode) {
    this.show();
    this.saveLastEpisode();
    this.nameEpisode.textContent = episode.title;
    if (this.currentEpisode?.id !== episode.id) {
      this.currentEpisode = episode;
      this.audio.src = episode.enclosureUrl;
      this.audio.load();
      this.audio.play();
      this.btnPlayer.classList.toggle("active", !this.audio.paused);
      this.updateUI();
      return;
    }

    if (this.audio.paused) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
    this.updateUI();
  }

  toogleCurrent() {
    if (!this.currentEpisode) return;

    if (this.audio.paused) {
      this.audio.play();
    } else {
      this.audio.pause();
      this.saveLastEpisode();
    }
    this.updateUI();
  }

  show() {
    this.player.classList.remove("hidden");
  }

  saveLastEpisode() {
    const episode = {
      ...this.currentEpisode,
      lastCurrentTime: Math.floor(this.audio.currentTime),
    };

    localStorage.setItem("lastEpisode", JSON.stringify(episode));
  }

  updateUI() {
    if (!this.currentEpisode) return;
    const isPlaying = !this.audio.paused;

    this.btnPlayer.classList.toggle("active", isPlaying);

    document.querySelectorAll<HTMLDivElement>(".episode").forEach((episode) => {
      const isCurrent = episode.dataset.id === String(this.currentEpisode.id);

      episode.classList.toggle("current", isCurrent);
      episode.classList.toggle("playing", isCurrent && isPlaying);
    });

    document
      .querySelectorAll<HTMLButtonElement>(".episode__btn-play")
      .forEach((btn) => {
        const isCurrent = btn.dataset.id === String(this.currentEpisode.id);

        btn.classList.toggle("active", isCurrent && isPlaying);
      });
  }

  goToPodcast() {
    router.navigate(`/details/${this.currentEpisode?.feedId}`);
    this.updateUI();
  }

  private updateProgress() {
    const current = this.audio.currentTime;

    this.currentTimeEl.textContent = this.formatTime(current);

    this.inputEl.value = String(current);
  }

  private formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  private updateDuration() {
    this.inputEl.max = String(this.audio.duration);

    this.durationEl.textContent = this.formatTime(this.audio.duration);
  }
}

export const player = new Player();

export function createUIPlayer() {
  const body: HTMLElement = document.body;
  const savedEpisode = localStorage.getItem("lastEpisode");
  const lastEpisode = savedEpisode ? JSON.parse(savedEpisode) : null;

  const player = createElement("div", { className: "player" });

  const topPlayer = createElement("div", { className: "player-top" });

  const btnGoToPdcast = createElement("button", {
    className: "btn-go-podcast",
  });
  btnGoToPdcast.textContent = "Go to playing podcast";
  const nameEpisode = createElement("p", { className: "player-name-episode" });

  topPlayer.append(nameEpisode, btnGoToPdcast);

  const bottomPart = createElement("div", { className: "player-bottom" });

  const playerBTN = createElement("button", { className: "player-btn" });
  const inputPlayer = createElement("input", { className: "player-input" });
  inputPlayer.type = "range";
  inputPlayer.name = "player";
  const updateTime = createElement("div", { className: "player-time" });
  const currentTime = createElement("span", {
    className: "player-current-time",
  });
  const duration = createElement("span", { className: "player-duration" });
  updateTime.append(currentTime, "/", duration);

  bottomPart.append(playerBTN, inputPlayer, updateTime);

  player.append(topPlayer, bottomPart);
  body.append(player);

  if (!lastEpisode) {
    player.classList.add("hidden");
  } else {
    nameEpisode.textContent = lastEpisode.title;
  }

  return {
    player,
    nameEpisode,
    playerBTN,
    currentTime,
    duration,
    inputPlayer,
    btnGoToPdcast,
    lastEpisode,
  };
}
