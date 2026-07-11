import { router } from "./router";

export function renderPlayListPage(app: HTMLDivElement) {
  const buttonSearch: HTMLButtonElement = document.createElement("button");
  buttonSearch.textContent = "Перейти на страницу поиска";

  const title: HTMLHeadingElement = document.createElement("h1");
  title.textContent = "Это страница плейлиста";

  app.append(title, buttonSearch);

  buttonSearch.addEventListener("click", () => {
    router.navigate("/");
  });
}
