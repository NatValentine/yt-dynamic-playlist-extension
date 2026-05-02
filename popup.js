async function loadTabs() {
  const tabs = await browser.tabs.query({});
  const ytTabs = tabs.filter(
    (tab) => tab.url && tab.url.includes("youtube.com/watch"),
  );

  const list = document.getElementById("list");
  list.innerHTML = "";

  if (ytTabs.length === 0) {
    list.innerHTML = "No YouTube tabs open.";
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

    item.innerHTML = `
    <div><strong>${info.playing ? "▶ " : ""}${info.title}</strong></div>
    <div>${info.channel}</div>
    <div>${info.duration}</div>
    `;

    item.addEventListener("click", async () => {
      await browser.tabs.update(tab.id, { active: true });
      await browser.windows.update(tab.windowId, { focused: true });
    });

    list.appendChild(item);
  }
}

loadTabs();
setInterval(loadTabs, 1000);
