/* import { router } from "./router"; */
import defaultImage from "../images/default-cover.png";
import { player } from "./player";
import {
  getEpisodesById,
  createElement,
  getPodcastById,
  loadImage,
} from "./search-page";
import type { Episode } from "./search-page";
/* import { player } from "./player"; */
export async function renderDetailsPodcastPage(
  app: HTMLDivElement,
  id?: string,
) {
  /*  const buttonSearch: HTMLButtonElement = document.createElement("button");
  buttonSearch.textContent = "Перейти на страницу поиска";
  buttonSearch.dataset.page = "/";

  const buttonPlaylist: HTMLButtonElement = document.createElement("button");
  buttonPlaylist.textContent = "Перейти на страницу плейлиста";
  buttonPlaylist.dataset.page = "playlist";

  const title: HTMLHeadingElement = document.createElement("h1");
  title.textContent = "Это страница деталий подкаста";

  app.append(buttonSearch, buttonPlaylist);

  buttonSearch.addEventListener("click", () => {
    const nextPage: string = buttonSearch.dataset.page || "/";
    router.navigate(nextPage);
  });

  buttonPlaylist.addEventListener("click", () => {
    const nextPage: string = buttonPlaylist.dataset.page || "/";
    router.navigate(nextPage);
  }); */

  const header = createElement("div", { className: "podcast-header" });
  const imgHeader = createElement("div", {
    className: "podcast-header__wrapper-img",
  });
  const wrapperInfoHeader = createElement("div", {
    className: "podcast-header__wrapper-title",
  });

  const type = createElement("p", { className: "podcast-header__type" });
  type.textContent = "Podcast";
  const namePodcast = createElement("h1", {
    className: "podcast-header__title",
  });
  const author = createElement("h2", { className: "podcast-header__author" });
  const podcastBody = createElement("div", {
    className: "podcast-body",
  });

  const containerEpisodes = createElement("div", {
    className: "podcast-body__container-episodes",
  });

  /*   containerEpisodes.addEventListener("click", (event: MouseEvent) => {
    const target = event.target as HTMLElement; 


    const btn = target.closest<HTMLButtonElement>(".episode__btn-play");


    if (btn && containerEpisodes.contains(btn)) {
      const allBtns = containerEpisodes.querySelectorAll(".episode__btn-play");
   
      allBtns.forEach((btn) => {
        btn.classList.remove("active");
      });
    }
    if (!player.audio.paused) {
      btn?.classList.add("active");
    }
  }); */

  const podcastDescription = createElement("p", {
    className: "podcast-body__description",
  });

  podcastBody.append(podcastDescription, containerEpisodes);

  wrapperInfoHeader.append(type, namePodcast, author);
  header.append(imgHeader, wrapperInfoHeader);
  app.append(header, podcastBody);

  if (id) {
    const [podcast, listEpisodes] = await Promise.all([
      getPodcastById(
        `/.netlify/functions/search?endpoint=/podcasts/byfeedid?id=${encodeURIComponent(id)}&pretty=true`,
      ),
      getEpisodesById(
        `/.netlify/functions/search?endpoint=episodes/byfeedid&id=${encodeURIComponent(id)}&max=100&pretty=true`,
      ),
    ]);

    namePodcast.textContent = podcast.title;
    author.textContent = podcast.author;
    podcastDescription.textContent = podcast.description;

    const imgPodcast = createElement("img", {
      className: "podcast-header__image",
    });
    imgPodcast.src = defaultImage;

    imgHeader.append(imgPodcast);
    loadImage(imgPodcast, podcast.image, podcast.artWork, 400);

    listEpisodes.forEach((episode) => {
      const cardEpisode = renderEpisode(episode);
      containerEpisodes.append(cardEpisode);
    });

    player.updateUI();
  } else {
    console.log("Неверный адрес страницы");
  }
}

function renderEpisode(episode: Episode) {
  const card = createElement("div", {
    className: "podcast-body__episode episode",
  });
  card.dataset.id = String(episode.id);

  const smallImg = createElement("img", {
    className: "episode__image",
  });
  smallImg.src = defaultImage;
  smallImg.loading = "lazy";

  const infoWrapper = createElement("div", {
    className: "episode__info-wrapper",
  });

  const titleEpisode = createElement("h3", {
    className: "episode__title",
  });
  titleEpisode.textContent = episode.title;

  const description = createElement("div", {
    className: "episode__description",
  });
  const temp = createElement("div");
  temp.innerHTML = episode.description;
  description.textContent = temp.textContent || "";

  const metaEpisode = createElement("div", {
    className: "episode__meta",
  });

  const episodMetaLeft = createElement("div", {
    className: "episode__meta-left",
  });

  const episodeBtnPlay = createElement("button", {
    className: "episode__btn-play",
  });
  episodeBtnPlay.dataset.id = `${episode.id}`;
  episodeBtnPlay.addEventListener("click", () => {
    player.toggleEpisode(episode);
  });

  const episodeDuration = createElement("p", {
    className: "episode__duration",
  });
  episodeDuration.textContent = getFormatDuration(episode.duration);

  const episodDate = createElement("p", {
    className: "episode__date",
  });
  episodDate.textContent = episode.datePublishedPretty;

  card.append(smallImg, infoWrapper);
  infoWrapper.append(titleEpisode, description, metaEpisode);
  episodMetaLeft.append(episodeBtnPlay, episodeDuration);
  metaEpisode.append(episodMetaLeft, episodDate);

  loadImage(smallImg, episode.image, episode.feedImage, 160);
  return card;
}

const getFormatDuration = (durationSec: number | null) => {
  if (durationSec) {
    let min = Math.floor(durationSec / 60);
    const secunds = durationSec - min * 60;
    return `${min.toString().padStart(2, "0")} min ${secunds.toString().padStart(2, "0")} sec`;
  }
  return "00 min 00 sec";
};

/* const getFormatDateRealize = (stringDate: string) => {
  const date = new Date(stringDate);

  const stringMonth = date.toLocaleDateString("ru-RU", {
    month: "long",
    day: "numeric",
  });

  const year = date.getFullYear().toString();
  return `${stringMonth} ${year}`;
}; */
