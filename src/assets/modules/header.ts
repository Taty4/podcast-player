import { router } from "./router";
import { createElement } from "./search-page";

export function renderHeader(currentPage: string) {
  const header = createElement("header", {
    className: "header",
  });

  const p = createElement("p", {
    className: "header-title",
    text: "Podcast Player",
  });

  const rightWrap = createElement("div", {
    className: "header-right",
  });

  header.append(p, rightWrap);

  const buttonSearch = createElement("button", {
    className: "btn-search header-btns",
    text: "Search",
  });
  buttonSearch.addEventListener("click", () => {
    router.navigate("/");
  });

  const buttonPlaylist = createElement("button", {
    className: "btn-playlist header-btns",
    text: "Playlist",
  });
  buttonPlaylist.addEventListener("click", () => {
    router.navigate("/playlist");
  });

  if (currentPage === "playlist") {
    rightWrap.append(buttonSearch);
  }

  if (currentPage === "search") {
    rightWrap.append(buttonPlaylist);
  }

  if (currentPage === "details") {
    rightWrap.append(buttonSearch, buttonPlaylist);
  }

  return header;
}
