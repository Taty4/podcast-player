import { router } from "./router";

export async function renderSearchPage(app: HTMLDivElement) {
  const searchForm = createElement("form", {
    className: "search__form form",
  });

  const searchInput = createElement("input", {
    className: "form__input",
  });

  searchInput.type = "text";
  searchInput.name = "search";

  searchInput.addEventListener("input", () => handleSearchInput(searchInput));

  const btnSubmitSearch = createElement("button", {
    className: "form__btn-submit",
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

  const data = await getBestPodcasts();
  createCardsPodcasts(data.podcasts);

  buttonPlaylist.addEventListener("click", () => {
    const nextPage: string = buttonPlaylist.dataset.page || "/";
    router.navigate(nextPage);
  });

  buttonDetails.addEventListener("click", () => {
    const nextPage: string = buttonDetails.dataset.page || "/";
    router.navigate(nextPage);
  });
}

function createElement<K extends keyof HTMLElementTagNameMap>(
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

interface Podcast {
  id: string;
  image: string;
  title: string;
  publisher: string;
  description: string;
}

/* interface ResponsBestPodcasts {
  podcasts: Podcast[];
} */

interface SearchResult {
  podcast: {
    id: string;
    title_original: string;
    description_original: string;
    image: string;
    publisher_original: string;
  };
  image: string;
  title: string;
  publisher: string;
}

interface ResponsSearchPodcasts {
  results: SearchResult[];
}

/* interface SearchQueryParams {
  q: string;
  type: "podcast";
  offset: number;
  only_in: string;
  language: string;
  page_size: number;
}

const params: SearchQueryParams = {
  q: "",
  type: "podcast",
  offset: 0,
  only_in: "title, description author",
  language: "English, Russia",
  page_size: 10,
}; */

async function getBestPodcasts() {
  try {
    const url = "/.netlify/functions/search?term=jack+johnson";
    const response = await fetch(url);

    const data = await response.json();

    console.log("Ответ от сервера: ", data);
    return data;
  } catch (error) {
    console.log("error");
    throw error;
  }
}

async function getSearchedPodcast(url: string) {
  try {
    const response = await fetch(url);
    const data = (await response.json()) as ResponsSearchPodcasts;
    console.log("Ответ от сервера при поиске: ", data);
    const results = data.results;
    return results.map((result) => ({
      id: result.podcast.id,
      title: result.podcast.title_original,
      image: result.podcast.image,
      publisher: result.podcast.publisher_original,
      description: "string",
    }));
  } catch (error) {
    console.log(error);
    throw error;
  }
}

function getSearchString(params: Record<string, string | number>) {
  return new URLSearchParams(
    Object.entries(params)
      .map(([key, value]) => [key, String(value)])
      .toString(),
  );
}

async function handleSearchInput(input: HTMLInputElement) {
  const value = input.value;

  let result;

  try {
    if (input.value === "") {
      result = await getBestPodcasts();
      createCardsPodcasts(result.podcasts);
    } else {
      const url = `/.netlify/functions/search?term=${getSearchString({
        q: value,
        type: "podcast",
        offset: 0,
        only_in: "title, description author",
        language: "English, Russia",
        page_size: 10,
      })}`;
      result = await getSearchedPodcast(url);
      createCardsPodcasts(result);
    }
  } catch (error) {
    console.log(error);
  }
}

function createCardsPodcasts(podcasts: Podcast[] | SearchResult[]) {
  const container = document.querySelector<HTMLDivElement>(".wrapper-podcasts");
  if (podcasts) {
    container?.replaceChildren();
    console.log(podcasts);
    podcasts.forEach((podcast) => {
      const card = createElement("div", {
        className: "wrapper-podcasts__card card",
      });

      const imageCard = createElement("img", { className: "card__img" });
      imageCard.src = podcast.image;

      const titleCard = createElement("p", {
        className: "card__title",
        text: podcast.title,
      });

      const authorText = createElement("p", {
        className: "card__author",
        text: podcast.publisher,
      });

      card.append(imageCard, titleCard, authorText);
      container?.append(card);
    });
  }
}
