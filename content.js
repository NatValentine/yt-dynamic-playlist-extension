browser.runtime.onMessage.addListener((msg) => {
  if (msg.type === "GET_VIDEO_INFO") {
    const video = document.querySelector("video");

    const title =
      document.querySelector("h1 yt-formatted-string")?.textContent ||
      document.title;

    const channel =
      document.querySelector("#channel-name a")?.textContent ||
      "Unknown channel";

    const duration = video ? formatTime(video.duration) : "--:--";

    const playing = video ? !video.paused && !video.ended : false;

    return Promise.resolve({
      title,
      channel,
      duration,
      playing,
    });
  }
});

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "--:--";

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  return `${m}:${String(s).padStart(2, "0")}`;
}
