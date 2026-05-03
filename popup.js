async function initToggle() {
  const toggle = document.getElementById("autoplayToggle");

  if (!toggle) {
    console.log("toggle not found");
    return;
  }

  const data = await browser.storage.local.get("enabled");

  toggle.checked = data.enabled === undefined ? true : data.enabled;

  toggle.addEventListener("change", async () => {
    await browser.storage.local.set({
      enabled: toggle.checked,
    });

    console.log("saved:", toggle.checked);
  });
}

async function loadTabs() {
  const tabs = await browser.tabs.query({});
  const ytTabs = tabs.filter(
    (tab) => tab.url && tab.url.includes("youtube.com/watch"),
  );

  const list = document.getElementById("list");
  list.replaceChildren();

  if (ytTabs.length === 0) {
    const empty = document.createElement("div");
    empty.textContent = "No YouTube tabs open.";
    list.appendChild(empty);
    return;
  }

  for (const tab of ytTabs) {
    let info = {
      title: tab.title,
      channel: "",
      duration: "--:--",
      playing: false,
    };

    try {
      info = await browser.tabs.sendMessage(tab.id, {
        type: "GET_VIDEO_INFO",
      });
    } catch (e) {}

    const item = document.createElement("div");
    item.className = info.playing ? "video current" : "video";

    const titleDiv = document.createElement("div");
    const strong = document.createElement("strong");

    strong.textContent = (info.playing ? "▶ " : "") + info.title;

    titleDiv.appendChild(strong);

    const channelDiv = document.createElement("div");
    channelDiv.textContent = info.channel;

    const durationDiv = document.createElement("div");
    durationDiv.textContent = info.duration;

    item.appendChild(titleDiv);
    item.appendChild(channelDiv);
    item.appendChild(durationDiv);

    item.addEventListener("click", async () => {
      await browser.tabs.update(tab.id, { active: true });
      await browser.windows.update(tab.windowId, { focused: true });
    });

    list.appendChild(item);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  initToggle();
  loadTabs();
});
