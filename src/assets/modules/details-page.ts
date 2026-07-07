import { router } from "./router";

export function renderDetailsPodcastPage(app: HTMLDivElement) {
  const buttonSearch: HTMLButtonElement = document.createElement("button");
  buttonSearch.textContent = "Перейти на страницу поиска";
  buttonSearch.dataset.page = "/";

  const buttonPlaylist: HTMLButtonElement = document.createElement("button");
  buttonPlaylist.textContent = "Перейти на страницу плейлиста";
  buttonPlaylist.dataset.page = "playlist";

  const title: HTMLHeadingElement = document.createElement("h1");
  title.textContent = "Это страница деталий подкаста";

  app.append(title, buttonSearch, buttonPlaylist);

  buttonSearch.addEventListener("click", () => {
    const nextPage: string = buttonSearch.dataset.page || "/";
    router.navigate(nextPage);
  });

  buttonPlaylist.addEventListener("click", () => {
    const nextPage: string = buttonPlaylist.dataset.page || "/";
    router.navigate(nextPage);
  });
}
