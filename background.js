browser.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "VIDEO_ENDED") {
    setTimeout(() => {
      handleEnded(sender.tab.id);
    }, 2000);
  }
});

async function handleEnded(tabId) {
  const result = await browser.storage.local.get("enabled");

  const enabled = result.enabled === undefined ? true : result.enabled === true;

  if (!enabled) return;

  playNext(tabId);
}

async function playNext(currentTabId) {
  const tabs = await browser.tabs.query({});

  const ytTabs = tabs.filter(
    (tab) => tab.url && tab.url.includes("youtube.com/watch"),
  );

  if (ytTabs.length <= 1) return;

  const index = ytTabs.findIndex((tab) => tab.id === currentTabId);

  let nextIndex = index + 1;

  if (nextIndex >= ytTabs.length) {
    nextIndex = 0;
  }

  const nextTab = ytTabs[nextIndex];

  await browser.tabs.update(nextTab.id, {
    active: true,
  });

  await browser.windows.update(nextTab.windowId, {
    focused: true,
  });

  setTimeout(async () => {
    await browser.tabs.sendMessage(nextTab.id, {
      type: "PLAY_VIDEO",
    });

    setTimeout(() => {
      browser.tabs.remove(currentTabId);
    }, 2000);
  }, 2500);

  await browser.tabs.remove(currentTabId);
}
