const themeToggleButton = document.querySelector("#theme");
const lightIcon = document.querySelector(".theme__light");
const darkIcon = document.querySelector(".theme__dark");

browser.storage.local.get("theme").then((data) => {
  const theme = data.theme || "light";
  return setTheme(theme);
});

function updateIcons(theme) {
  if (theme === "light") {
    lightIcon.style.display = "none";
    darkIcon.style.display = "block";
  } else {
    lightIcon.style.display = "block";
    darkIcon.style.display = "none";
  }
}

function setTheme(theme) {
  browser.storage.local.set({ theme: theme });
  document.documentElement.setAttribute("data-theme", theme);
  updateIcons(theme);
}

themeToggleButton.addEventListener("click", () => {
  browser.storage.local.get("theme").then((data) => {
    return setTheme(data.theme === "light" ? "dark" : "light");
  });
});