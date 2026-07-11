import { router } from "./router";
import defaultImage from "../images/default-cover.png";

let timerId: number | undefined;

export async function renderSearchPage(app: HTMLDivElement) {
  const searchForm = createElement("form", {
    className: "search__form form",
  });

  const searchInput = createElement("input", {
    className: "form__input",
  });

  searchInput.type = "text";
  searchInput.name = "search";

  searchInput.addEventListener("input", () => {
    clearTimeout(timerId);
    timerId = window.setTimeout(async () => {
      const podcasts = await handleSearchInput();
      wrapperCards.replaceChildren();
      if (podcasts) {
        podcasts.forEach((podcast) => {
          wrapperCards.append(createCardPodcast(podcast));
        });
      }
    }, 3000);
  });

  const btnSubmitSearch = createElement("button", {
    className: "form__btn-submit",
  });

  btnSubmitSearch.addEventListener("click", async (e) => {
    e.preventDefault();
    const podcasts = await handleSearchInput();
    wrapperCards.replaceChildren();
    if (podcasts) {
      podcasts.forEach((podcast) => {
        wrapperCards.append(createCardPodcast(podcast));
      });
    }
  });

  searchForm.append(searchInput, btnSubmitSearch);

  const wrapperCards = createElement("div", {
    className: "search__wrapper-podcasts wrapper-podcasts",
  });

  const buttonPlaylist: HTMLButtonElement = document.createElement("button");

  buttonPlaylist.textContent = "Перейти на страницу плейлиста";
  buttonPlaylist.dataset.page = "playlist";

  const title: HTMLHeadingElement = document.createElement("h1");
  title.textContent = "Это страница поиска";

  app.append(title, searchForm, buttonPlaylist);
  app.append(wrapperCards);

  const bestPodcasts = await getBestPodcasts();

  bestPodcasts.forEach((podcast) => {
    wrapperCards.append(createCardPodcast(podcast));
  });

  buttonPlaylist.addEventListener("click", () => {
    const nextPage: string = buttonPlaylist.dataset.page || "/";
    router.navigate(nextPage);
  });
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options?: {
    className?: string;
    text?: string;
  },
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);

  if (options?.className) {
    element.className = options.className;
  }

  if (options?.text) {
    element.textContent = options.text;
  }

  return element;
}

export interface PodcastSearch {
  image: string;
  id: number;
  author: string;
  title: string;
  artWork: string;
}

export interface APIResponseSearch {
  feeds: PodcastSearch[];
}

export interface PodcastTrend {
  image: string;
  id: number;
  author: string;
  title: string;
  trendScore: number;
  artWork: string;
}

export interface Podcast {
  image: string;
  id: number;
  author: string;
  title: string;
  trendScore: number;
  artWork: string;
}

export interface Episode {
  image: string;
  id: number;
  title: string;
  artWork: string;
  description: string;
  duration: number | null;
  datePublishedPretty: string;
  enclosureUrl: string;
  feedImage: string;
}

export interface APIResponseEpisodes {
  items: Episode[];
}

export interface APIResponseTrends {
  feeds: PodcastTrend[];
}

export interface APIResponsePodcast {
  feeds: Podcast[];
}

/* export interface APIRespons {
  feeds: Podcast[];
} */
/* export interface ResponsAPISearchedPodcasts {
  feeds: SearchedPodcast[];
} */

async function getBestPodcasts(): Promise<PodcastTrend[]> {
  try {
    const url =
      "/.netlify/functions/search?endpoint=podcasts/trending?pretty=true";
    const response = await fetch(url);

    const data: APIResponseTrends = await response.json();
    console.log(data);
    return data.feeds;
  } catch (error) {
    console.log("error");
    throw error;
  }
}

export async function getSearchedPodcast(
  url: string,
): Promise<PodcastSearch[]> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error();
    }

    const data: APIResponseSearch = await response.json();

    /*     if (!data.feeds || data.feeds.length === 0) {
      throw new Error();
    } */

    console.log("Ответ от сервера c результатом поиска обычного: ", data);
    return data.feeds;
  } catch (error) {
    console.log("Ошибка запроса или ничего не найдено");
    throw error;
  }
}

export async function getEpisodesById(url: string): Promise<Episode[]> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error();
    }

    const data: APIResponseEpisodes = await response.json();

    /*     if (!data.feeds || data.feeds.length === 0) {
      throw new Error();
    } */

    console.log("Ответ от сервера c результатом поиска подкастов: ", data);
    return data.items;
  } catch (error) {
    console.log("Ошибка запроса или ничего не найдено");
    throw error;
  }
}

export async function getPodcastById(url: string): Promise<APIResponsePodcast> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error();
    }

    const data: APIResponsePodcast = await response.json();

    /*     if (!data.feeds || data.feeds.length === 0) {
      throw new Error();
    } */

    console.log("Ответ от сервера c результатом поиска подкаста: ", data);
    return data;
  } catch (error) {
    console.log("Ошибка запроса или ничего не найдено");
    throw error;
  }
}

async function handleSearchInput() {
  let query = document.querySelector<HTMLInputElement>(".form__input")?.value;

  try {
    console.log(!!query + " значение инпута");

    if (query === "" || !query) {
      const podcasts = await getBestPodcasts();
      return podcasts;
    } else {
      const podcasts = await getSearchedPodcast(
        `/.netlify/functions/search?endpoint=search/byterm&q=${encodeURIComponent(query)}&pretty=true`,
      );
      return podcasts;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

function createCardPodcast(podcast: PodcastTrend | PodcastSearch) {
  const card = createElement("div", {
    className: "wrapper-podcasts__card card",
  });

  const imageCard = createElement("img", { className: "card__img" });
  setPodcastImage(imageCard, podcast);
  imageCard.loading = "lazy";
  card.dataset.idPodcast = `${podcast.id}`;

  const titleCard = createElement("p", {
    className: "card__title",
    text: podcast.title,
  });

  const authorText = createElement("p", {
    className: "card__author",
    text: podcast.author,
  });

  card.append(imageCard, titleCard, authorText);

  card.addEventListener("click", () => handleCardClick(podcast));
  return card;
}

export function setPodcastImage(
  img: HTMLImageElement,
  podcast: PodcastTrend | PodcastSearch,
) {
  const sources = [podcast.artWork, podcast.image, defaultImage];

  let index = 0;

  img.src = sources[index];
  /*   let optimazedURL = sources[index]; */

  img.onerror = () => {
    index++;

    if (index < sources.length) {
      img.src = sources[index];
    }
  };
}

export function setEpisodeImage(img: HTMLImageElement, podcast: Episode) {
  const sources = [podcast.image, podcast.feedImage, defaultImage];
  let index = 0;
  img.src = sources[index];
  /*   let optimazedURL = sources[index]; */

  img.onerror = () => {
    index++;

    if (index < sources.length) {
      img.src = sources[index];
    }
  };
}

function handleCardClick(podcast: PodcastSearch | PodcastTrend) {
  const id = podcast.id;
  router.navigate(`/details/${id}`);
}
