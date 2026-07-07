import { router } from "./router";

export function renderSearchPage(app: HTMLDivElement) {
  const searchForm = createElement("form", {
    className: "search__form form",
  });

  const searchInput = createElement("input", {
    className: "form__input",
  });

  searchInput.type = "text";
  searchInput.name = "search";

  const btnSubmitSearch = createElement("button", {
    className: "form__btn-submit",
  });

  searchForm.append(searchInput, btnSubmitSearch);

  const wrapperCards = createElement("div", {
    className: "search__wrapper-podcasts, wrapper-podcasts",
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

function createPodcastsCard() {}
