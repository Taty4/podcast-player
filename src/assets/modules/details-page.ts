/* import { router } from "./router"; */
import { getSearchedPodcast, createElement } from "./search-page";
import type { ResultsApi } from "./search-page";

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
    const listEpisodes = await getSearchedPodcast(
      `/.netlify/functions/search?id=${encodeURIComponent(id)}&entity=podcastEpisode&limit=20&`,
    );

    const podcastInfo = listEpisodes[0];

    namePodcast.textContent = podcastInfo.collectionName;
    if (podcastInfo.artistName) {
      author.textContent = podcastInfo.artistName;
    }

    const imgPodcast = createElement("img", {
      className: "podcast-header__image",
    });
    imgPodcast.src = podcastInfo.artworkUrl600;

    imgHeader.append(imgPodcast);

    renderEpisodes(listEpisodes, containerEpisodes);
  } else {
    console.log("Неверный адрес страницы");
  }
}

function renderEpisodes(episodes: ResultsApi[], container: HTMLDivElement) {
  const onlyEpisodes = episodes.slice(1);
  onlyEpisodes.forEach((episode, index) => {
    const card = createElement("div", {
      className: "podcast-body__episode episod",
    });

    if (index === 0) {
      card.classList.add("active");
      /*       if (fullSDec && episode.description) {
        fullSDec.textContent = episode.description;
      } */
    }

    const smallImg = createElement("img", {
      className: "episod__image",
    });
    if (episode.artworkUrl160) {
      smallImg.src = episode.artworkUrl160;
    }

    const infoWrapper = createElement("div", {
      className: "episod__info-wrapper",
    });

    const titleEpisode = createElement("h3", {
      className: "episod__title",
    });
    titleEpisode.textContent = episode.trackName;

    const description = createElement("p", {
      className: "episod__description",
    });
    if (episode.shortDescription && episode.shortDescription !== "") {
      description.textContent = episode.shortDescription;
    } else if (!episode.shortDescription || episode.shortDescription === "") {
      if (episode.description && episode.description !== "") {
        description.textContent = `${episode.description.slice(0, 320)}...`;
      }
    }

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
    episodeDuration.textContent = getFormatDuration(episode.trackTimeMillis);

    const episodDate = createElement("p", {
      className: "episod__date",
    });

    if (episode.releaseDate) {
      episodDate.textContent = getFormatDateRealize(episode.releaseDate);
    }

    card.append(smallImg, infoWrapper);
    infoWrapper.append(titleEpisode, description, metaEpisode);
    episodMetaLeft.append(episodeBtnPlay, episodeDuration);
    metaEpisode.append(episodMetaLeft, episodDate);
    container.append(card);
  });
}

const getFormatDuration = (milisec: number) => {
  const sec = Math.round(milisec / 1000);

  let min = Math.floor(sec / 60);
  const secunds = sec - min * 60;

  return `${min.toString().padStart(2, "0")} min ${secunds.toString().padStart(2, "0")} sec`;
};

const getFormatDateRealize = (stringDate: string) => {
  const date = new Date(stringDate);

  const stringMonth = date.toLocaleDateString("ru-RU", {
    month: "long",
    day: "numeric",
  });

  const year = date.getFullYear().toString();
  return `${stringMonth} ${year}`;
};
