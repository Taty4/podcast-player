import { renderSearchPage } from "./search-page";
import { renderDetailsPodcastPage } from "./details-page";
import { renderPlayListPage } from "./playList-page";

type Routes = {
  [key: string]: (app: HTMLDivElement, id?: string) => void;
};

const routes: Routes = {
  "/": renderSearchPage,
  "/playlist": renderDetailsPodcastPage,
  "/details": renderDetailsPodcastPage,
};

class Router {
  readonly routes;
  readonly app;

  constructor(routes: Routes) {
    this.routes = routes;

    this.app = document.querySelector<HTMLDivElement>(".app");
    this.init();
  }

  init() {
    this.renderCurrentPage();
    window.addEventListener("popstate", () => {
      this.renderCurrentPage();
    });
  }

  navigate(page: string) {
    history.pushState({}, "", page);
    this.renderCurrentPage();
  }

  renderCurrentPage() {
    const path = window.location.pathname;
    if (path.startsWith("/details/")) {
      const id = path.split("/")[2];
      if (this.app) {
        this.app.replaceChildren();
        renderDetailsPodcastPage(this.app, id);
        return;
      }
    } else {
      if (path in this.routes) {
        if (this.app) {
          this.app.replaceChildren();
          this.routes[path](this.app);
        }
      } else {
        console.log("потом допишу страницу ошибки");
      }
    }
  }
}

export const router = new Router(routes);
