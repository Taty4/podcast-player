import { router } from "./router";

export function renderPlayListPage(app: HTMLDivElement) {
  const buttonSearch: HTMLButtonElement = document.createElement("button");
  buttonSearch.textContent = "Перейти на страницу поиска";
  buttonSearch.dataset.page = "/";

  const buttonDetails: HTMLButtonElement = document.createElement("button");
  buttonDetails.textContent = "Перейти на страницу деталей";
  buttonDetails.dataset.page = "details";

  const title: HTMLHeadingElement = document.createElement("h1");
  title.textContent = "Это страница плейлиста";

  app.append(title, buttonSearch, buttonDetails);

  buttonSearch.addEventListener("click", () => {
    const nextPage: string = buttonSearch.dataset.page || "/";
    router.navigate(nextPage);
  });

  buttonDetails.addEventListener("click", () => {
    const nextPage: string = buttonDetails.dataset.page || "/";
    router.navigate(nextPage);
  });
}
