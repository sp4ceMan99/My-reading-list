const themeToggleButton = document.querySelector("#theme");
const lightIcon = document.querySelector(".theme__light");
const darkIcon = document.querySelector(".theme__dark");

let currentTheme = "light"; // Variable pour stocker le thème actuel

browser.storage.sync.get("theme").then((data) => {
  if(data.theme) {
    console.log("Thème récupéré depuis sync :", data.theme);
    currentTheme = data.theme;
  } else {
    browser.storage.local.get("theme").then((data) => {
      console.log("Thème récupéré depuis le local storage :", localData.theme);
      currentTheme = data.theme || "light";
    });
  }
  setTheme(currentTheme);
});

const setTheme = (theme) => {
  browser.storage.sync.set({ theme: theme }).then((data) => {
    console.log("Thème défini dans sync :", theme);
  });
  
  browser.storage.local.set({ theme: theme }).then((data) => {
    console.log("Thème défini dans local :", theme);
  });

  document.documentElement.setAttribute("data-theme", theme);
  updateIcons(theme);
  currentTheme = theme;
}

function updateIcons(theme) {
  if (theme === "light") {
    lightIcon.style.display = "none";
    darkIcon.style.display = "block";
  } else {
    lightIcon.style.display = "block";
    darkIcon.style.display = "none";
  }
}

// Gestionnaire d'événement pour le bouton de basculement de thème
themeToggleButton.addEventListener("click", () => {
  const newTheme = currentTheme === "light" ? "dark" : "light";
  setTheme(newTheme);
});

// Écouter les changements dans sync
browser.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.theme) {
    const newTheme = changes.theme.newValue;
    if (newTheme !== currentTheme) {
      console.log("Thème changé dans sync :", newTheme);
      setTheme(newTheme);
    }
  }
});