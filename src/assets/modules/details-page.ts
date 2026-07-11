/* import { router } from "./router"; */
import {
  getEpisodesById,
  createElement,
  setEpisodeImage,
  getPodcastById,
} from "./search-page";
import type { APIResponseEpisodes, Episode } from "./search-page";

export async function renderDetailsPodcastPage(
  app: HTMLDivElement,
  id?: string,
) {
  /*   const buttonSearch: HTMLButtonElement = document.createElement("button");
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

  const containerDescription = createElement("div", {
    className: "podcast-body__container-description",
  });

  podcastBody.append(containerEpisodes, containerDescription);

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
    /*     if (podcastInfo.artistName) {
      author.textContent = podcastInfo.artistName;
    } */

    const imgPodcast = createElement("img", {
      className: "podcast-header__image",
    });
    imgPodcast.src = podcast.image;

    imgHeader.append(imgPodcast);

    listEpisodes.forEach((episode) => {
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
  if (episode.image) {
    setEpisodeImage(smallImg, episode);
  }

  const infoWrapper = createElement("div", {
    className: "episod__info-wrapper",
  });

  const titleEpisode = createElement("h3", {
    className: "episod__title",
  });
  titleEpisode.textContent = episode.title;

  const description = createElement("p", {
    className: "episod__description",
  });
  description.innerHTML = episode.description;

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
