const aboutsyncBTN = document.querySelector(".aboutsyncBTN");
const aboutsyncInfo = document.querySelector(".aboutsync");
const aboutsyncGotit = document.querySelector(".aboutsync__gotit");

function updateDisplay(showInfo) {
  aboutsyncInfo.style.display = showInfo ? "block" : "none";
  aboutsyncBTN.style.display = showInfo ? "none" : "block";
}

function handleSyncState(newState) {
  browser.storage.local.set({ aboutsync: newState }).then(() => {
    updateDisplay(newState);
    console.log(newState ? "Show about sync!" : "Got it!");
  });
}

browser.storage.local.get("aboutsync").then((data) => {
  const aboutsync = data.aboutsync !== undefined ? data.aboutsync : true;
  updateDisplay(aboutsync);
});

aboutsyncGotit.addEventListener("click", () => handleSyncState(false));
aboutsyncBTN.addEventListener("click", () => handleSyncState(true));