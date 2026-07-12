import { router } from "./router";
import { createElement } from "./search-page";
import type { Episode } from "./search-page";
import { renderEpisode } from "./details-page";
import { renderHeader } from "./header";

export function renderPlayListPage(app: HTMLDivElement) {
  app.append(renderHeader("playlist"));

  const playListContainer = createElement("div", {
    className: "container-playlist-cards",
  });

  const episodesPlaylist = playList.getLatestPlaylist();
  app.append(playListContainer);

  if (episodesPlaylist.length !== 0) {
    episodesPlaylist.forEach((episode) => {
      const btnRemoveFromPlaylist = createElement("button", {
        className: "btn-remove-episode",
        text: "Remove from playlist",
      });
      btnRemoveFromPlaylist.addEventListener("click", () => {
        playList.removeEpisode(episode);
      });

      const cardEpisode = renderEpisode(episode, btnRemoveFromPlaylist);
      const feedTitle = createElement("p", {
        className: "playlist-feed-title",
        text: `Podcast: "${episode.feedTitle}"`,
      });
      feedTitle.dataset.feedId = String(episode.feedId);
      cardEpisode.prepend(feedTitle);
      playListContainer.append(cardEpisode);
    });
  } else {
    playList.setDefaultText();
  }

  playListContainer.addEventListener("click", (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    const title = target.closest<HTMLDivElement>(".playlist-feed-title");

    if (title && playListContainer.contains(title)) {
      router.navigate(`/details/${title.dataset.feedId}`);
    }
  });
}

class PlayList {
  playList: Episode[];

  constructor() {
    const playList = localStorage.getItem("playList-taty4");
    this.playList = playList ? JSON.parse(playList) : [];
  }

  addEpisode(episode: Episode, feedTitle: string) {
    this.playList = this.getLatestPlaylist();
    if (this.playList.some((ep) => ep.id === episode.id)) return;

    this.playList.push({ ...episode, feedTitle: feedTitle });
    this.savePlaylist();
    this.updateUI();
  }

  removeEpisode(episode: Episode) {
    const oldPlaylist = this.getLatestPlaylist();
    const removedEl = document.querySelector(
      `.episode[data-id='${String(episode.id)}']`,
    );
    removedEl?.remove();
    this.playList = oldPlaylist.filter((ep: Episode) => ep.id !== episode.id);
    if (this.playList.length === 0) {
      this.setDefaultText();
    }
    this.savePlaylist();
  }

  getLatestPlaylist(): Episode[] {
    const lastSavedPlayList = localStorage.getItem("playList-taty4");
    return lastSavedPlayList ? JSON.parse(lastSavedPlayList) : [];
  }

  savePlaylist() {
    localStorage.setItem("playList-taty4", JSON.stringify(this.playList));
  }

  updateUI() {
    const allBtnsAdd =
      document.querySelectorAll<HTMLButtonElement>(".btn-add-episode");

    const playistsIds = new Set(this.getLatestPlaylist().map((e) => e.id));
    allBtnsAdd.forEach((btn) => {
      const id = btn.dataset.id;
      if (playistsIds.has(Number(id))) {
        btn.disabled = true;
        btn.textContent = "Added";
      } else {
        btn.disabled = false;
        btn.textContent = "Add to playlist";
      }
    });
  }

  setDefaultText() {
    const container = document.querySelector<HTMLDivElement>(
      ".container-playlist-cards",
    );

    const p = createElement("p", {
      className: "playlist-dafault-text",
      text: "You haven't added any episodes to the playlist yet. Go to the search page to do so",
    });
    container?.append(p);
  }
}

export const playList = new PlayList();
