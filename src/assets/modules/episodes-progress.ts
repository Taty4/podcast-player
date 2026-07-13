const storageKey = "episodesProgressTaty4";

export function getEpisodeProgress() {
  const storage = localStorage.getItem(storageKey);
  return storage ? JSON.parse(storage) : {};
}

export function saveEpisodeProgress(episodeId: string, currentTime: number) {
  const progress = getEpisodeProgress();

  progress[episodeId] = currentTime;

  localStorage.setItem(storageKey, JSON.stringify(progress));
}
