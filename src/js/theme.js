const themeToggleButton = document.querySelector("#theme");
const lightIcon = document.querySelector(".theme__light");
const darkIcon = document.querySelector(".theme__dark");

let currentTheme;

browser.storage.sync.get("theme").then((data) => {
  console.log("Theme retrieved from sync :", data.theme);
  currentTheme = data.theme || "light";
  setTheme(currentTheme);
});

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  updateIcons(theme);
  currentTheme = theme;
}

function updateIcons(theme) {
  lightIcon.style.display = theme === "light" ? "none" : "block";
  darkIcon.style.display = theme === "light" ? "block" : "none";
}

themeToggleButton.addEventListener("click", () => {
  const theme = currentTheme === "light" ? "dark" : "light"
  setTheme(theme);
  browser.storage.sync.set({ theme: theme }).then(() => {
    console.log("Theme set in sync :", theme);
  });
});

browser.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.theme) {
    const newTheme = changes.theme.newValue;
    if (newTheme !== currentTheme) {
      console.log("Theme changed in sync :", newTheme);
      setTheme(newTheme);
    }
  }
});