const themeToggleButton = document.querySelector("#theme");
const lightIcon = document.querySelector(".theme__light");
const darkIcon = document.querySelector(".theme__dark");

let currentTheme = "light"; // Variable pour stocker le thème actuel

async function getTheme() {
  try {
    const syncData = await browser.storage.sync.get("theme");
    if (syncData.theme) {
      console.log("Thème récupéré depuis sync :", syncData.theme);
      currentTheme = syncData.theme;
      return syncData.theme;
    }
  } catch (error) {
    console.warn("Sync non disponible, utilisation du stockage local :", error);
  }

  const localData = await browser.storage.local.get("theme");
  console.log("Thème récupéré depuis local :", localData.theme);
  currentTheme = localData.theme || "light";
  return currentTheme;
}

async function setTheme(theme) {
  if (currentTheme === theme) {
    console.log("Le thème est déjà défini à :", theme);
    return; // Ne rien faire si le thème est déjà le même
  }

  try {
    await browser.storage.sync.set({ theme: theme });
    console.log("Thème défini dans sync :", theme);
  } catch (error) {
    console.warn("Sync non disponible, utilisation du stockage local :", error);
  }

  await browser.storage.local.set({ theme: theme });
  console.log("Thème défini dans local :", theme);

  document.documentElement.setAttribute("data-theme", theme);
  updateIcons(theme);
  currentTheme = theme; // Mettre à jour la variable du thème actuel
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

// Initialisation du thème au chargement de la page
getTheme().then((theme) => {
  setTheme(theme);
});

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