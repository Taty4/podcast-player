import { router } from "./router";
import defaultImage from "../images/default-cover.webp";
import { renderHeader } from "./header";

let timerId: number | undefined;

export async function renderSearchPage(app: HTMLDivElement) {
  app.append(renderHeader("search"));

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
          const card = createCardPodcast(podcast);
          wrapperCards.append(card);
        });
      }
    }, 500);
  });

  const btnSubmitSearch = createElement("button", {
    className: "form__btn-submit",
    text: "Search",
  });

  btnSubmitSearch.addEventListener("click", async (e) => {
    e.preventDefault();
    clearTimeout(timerId);
    const podcasts = await handleSearchInput();
    wrapperCards.replaceChildren();
    if (podcasts) {
      podcasts.forEach((podcast) => {
        const card = createCardPodcast(podcast);
        wrapperCards.append(card);
      });
    }
  });

  searchForm.append(searchInput, btnSubmitSearch);

  const wrapperCards = createElement("div", {
    className: "search__wrapper-podcasts wrapper-podcasts",
  });

  const title: HTMLHeadingElement = document.createElement("h1");
  title.textContent = "Это страница поиска";

  app.append(searchForm);
  app.append(wrapperCards);

  const bestPodcasts = await getBestPodcasts();

  bestPodcasts.forEach((podcast) => {
    const card = createCardPodcast(podcast);
    wrapperCards.append(card);
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

export interface APIResponseTrends {
  feeds: PodcastTrend[];
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
  feedId: number;
  currentTime: number;
  feedTitle: string;
}

export interface APIResponseEpisodes {
  items: Episode[];
}

export interface Podcast {
  image: string;
  artWork: string;
  id: number;
  author: string;
  title: string;
  description: string;
}
export interface APIResponsePodcast {
  feed: Podcast;
}

async function getBestPodcasts(): Promise<PodcastTrend[]> {
  try {
    const url =
      "/.netlify/functions/search?endpoint=podcasts/trending?pretty=true";
    const response = await fetch(url);

    const data: APIResponseTrends = await response.json();
    return data.feeds;
  } catch (error) {
    console.log(error);
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
    return data.feeds;
  } catch (error) {
    console.log(error);
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
    return data.items;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getPodcastById(url: string): Promise<Podcast> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error();
    }

    const data: APIResponsePodcast = await response.json();

    return data.feed;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function handleSearchInput() {
  let query = document.querySelector<HTMLInputElement>(".form__input")?.value;

  try {
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
  imageCard.src = defaultImage;
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
  loadImage(imageCard, podcast.image, podcast.artWork, 250);
  return card;
}

export async function loadImage(
  img: HTMLImageElement,
  url1: string,
  url2: string,
  size: number,
) {
  const src = await getSmallValidImg(url1, url2, size);

  img.src = src;
}

function handleCardClick(podcast: PodcastSearch | PodcastTrend) {
  const id = podcast.id;
  router.navigate(`/details/${id}`);
}

export async function getSmallValidImg(
  url1: string,
  url2: string,
  size: number,
): Promise<string> {
  const checkImage = (src: string, size: number): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      const img: HTMLImageElement = new Image();
      img.src = `https://wsrv.nl?url=${encodeURIComponent(src)}&w=${size}&fit=cover`;
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  };

  const isFirstValid: boolean = await checkImage(url1, size);
  if (isFirstValid)
    return `https://wsrv.nl?url=${encodeURIComponent(url1)}&w=${size}&fit=cover`;

  const isSecondValid: boolean = await checkImage(url2, size);
  if (isSecondValid)
    return `https://wsrv.nl?url=${encodeURIComponent(url2)}&w=${size}&fit=cover`;

  return defaultImage;
}
