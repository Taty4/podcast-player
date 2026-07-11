/* import { router } from "./router"; */
import defaultImage from "../images/default-cover.png";
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
    loadImage(imgPodcast, podcast, 400);

    listEpisodes.forEach(async (episode) => {
      const cardEpisode = renderEpisode(episode);
      containerEpisodes.append(cardEpisode);
    });
  } else {
    console.log("Неверный адрес страницы");
  }
}

function renderEpisode(episode: Episode) {
  const card = createElement("div", {
    className: "podcast-body__episode episod",
  });

  const smallImg = createElement("img", {
    className: "episod__image",
  });
  smallImg.src = defaultImage;
  smallImg.loading = "lazy";

  const infoWrapper = createElement("div", {
    className: "episod__info-wrapper",
  });

  const titleEpisode = createElement("h3", {
    className: "episod__title",
  });
  titleEpisode.textContent = episode.title;

  const description = createElement("div", {
    className: "episod__description",
  });
  const temp = createElement("div");
  temp.innerHTML = episode.description;
  description.textContent = temp.textContent || "";

  const metaEpisode = createElement("div", {
    className: "episod__meta",
  });

  const episodMetaLeft = createElement("div", {
    className: "episod__meta-left",
  });

  const episodeBtnPlay = createElement("button", {
    className: "episod__btn-play",
  });
  episodeBtnPlay.textContent = "▶";

  const episodeDuration = createElement("p", {
    className: "episod__duration",
  });
  episodeDuration.textContent = getFormatDuration(episode.duration);

  const episodDate = createElement("p", {
    className: "episod__date",
  });
  episodDate.textContent = episode.datePublishedPretty;

  card.append(smallImg, infoWrapper);
  infoWrapper.append(titleEpisode, description, metaEpisode);
  episodMetaLeft.append(episodeBtnPlay, episodeDuration);
  metaEpisode.append(episodMetaLeft, episodDate);

  loadImage(smallImg, episode, 160);
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
