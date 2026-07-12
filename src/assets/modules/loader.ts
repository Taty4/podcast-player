function createLoader() {
  const loader = document.createElement("div");
  loader.className = "loader hidden";

  loader.innerHTML = `
    <div class="loader__spinner"></div>
  `;

  return {
    element: loader,

    show() {
      loader.classList.remove("hidden");
    },

    hide() {
      loader.classList.add("hidden");
    },
  };
}

export const loader = createLoader();
