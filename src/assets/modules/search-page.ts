import { router } from "./router";

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
    timerId = window.setTimeout(() => {
      handleSearchInput();
    }, 3000);
  });

  const btnSubmitSearch = createElement("button", {
    className: "form__btn-submit",
  });

  btnSubmitSearch.addEventListener("click", (e) => {
    e.preventDefault();
    handleSearchInput();
  });

  searchForm.append(searchInput, btnSubmitSearch);

  const wrapperCards = createElement("div", {
    className: "search__wrapper-podcasts wrapper-podcasts",
  });

  const buttonPlaylist: HTMLButtonElement = document.createElement("button");
  buttonPlaylist.textContent = "Перейти на страницу плейлиста";
  buttonPlaylist.dataset.page = "playlist";

  const buttonDetails: HTMLButtonElement = document.createElement("button");
  buttonDetails.textContent = "Перейти на страницу деталей";
  buttonDetails.dataset.page = "details";

  const title: HTMLHeadingElement = document.createElement("h1");
  title.textContent = "Это страница поиска";

  app.append(title, searchForm, buttonPlaylist, buttonDetails);
  app.append(wrapperCards);

  const results = await getBestPodcasts();
  createCardsPodcasts(results);

  buttonPlaylist.addEventListener("click", () => {
    const nextPage: string = buttonPlaylist.dataset.page || "/";
    router.navigate(nextPage);
  });

  buttonDetails.addEventListener("click", () => {
    const nextPage: string = buttonDetails.dataset.page || "/";
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

export interface ResultsApi {
  artworkUrl160?: string;
  releaseDate?: string;
  artistName?: string;
  artworkUrl600: string;
  collectionId: number;
  collectionName: string;
  trackName: string;
  shortDescription?: string;
  trackTimeMillis: number;
  description?: string;
  trackViewUrl: string;
  wrapperType: "podcastEpisode" | "track";
}

export interface ResponsAPI {
  results: ResultsApi[];
}

async function getBestPodcasts() {
  try {
    const url = "/.netlify/functions/search?term=beautiful";
    const response = await fetch(url);

    const data = (await response.json()) as ResponsAPI;

    console.log("Ответ от сервера с результатами лучших: ", data.results);
    return data.results;
  } catch (error) {
    console.log("error");
    throw error;
  }
}

export async function getSearchedPodcast(url: string) {
  try {
    const response = await fetch(`${url}`);

    if (!response.ok) {
      throw new Error();
    }
    console.log(response.status);

    const data = (await response.json()) as ResponsAPI;

    if (!data.results || data.results.length === 0) {
      throw new Error();
    }

    console.log(
      "Ответ от сервера с результатом поиска обычного: ",
      data.results,
    );
    return data.results;
  } catch (error) {
    console.log("Ошибка запроса или ничего не найдено");
    throw error;
  }
}

async function handleSearchInput() {
  let term = document.querySelector<HTMLInputElement>(".form__input")?.value;

  let result;

  try {
    if (term === "") {
      result = await getBestPodcasts();
      createCardsPodcasts(result);
    } else {
      if (term) {
        result = await getSearchedPodcast(
          `/.netlify/functions/search?term=${encodeURIComponent(term)}`,
        );
        createCardsPodcasts(result);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function createCardsPodcasts(podcasts: ResultsApi[]) {
  const container = document.querySelector<HTMLDivElement>(".wrapper-podcasts");
  if (podcasts) {
    container?.replaceChildren();

    podcasts.forEach((podcast) => {
      const card = createElement("div", {
        className: "wrapper-podcasts__card card",
      });

      const imageCard = createElement("img", { className: "card__img" });
      imageCard.src = podcast.artworkUrl600;
      card.dataset.idPodcast = `${podcast.collectionId}`;

      const titleCard = createElement("p", {
        className: "card__title",
        text: podcast.collectionName,
      });

      const authorText = createElement("p", {
        className: "card__author",
        text: podcast.artistName,
      });

      card.append(imageCard, titleCard, authorText);
      container?.append(card);

      card.addEventListener("click", () => handleCardClick(card));
    });
  }
}

async function handleCardClick(card: HTMLDivElement) {
  const id = card.dataset.idPodcast;
  router.navigate(`/details/${id}`);
}
