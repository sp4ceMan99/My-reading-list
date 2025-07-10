document.addEventListener('DOMContentLoaded', function() {

  const app = document.querySelector('#app');
  const addItem = document.querySelector('#add');
  const searchInput = document.querySelector('.search__input');
  const clearSearchButton = document.querySelector('.search__clear');

  let list = [];
  let currentSearchText = '';

  browser.storage.sync.get("list").then((data) => {
    list = data.list || [];
    list.forEach((item) => {
      addItemToDom(item);
    });
  });

  browser.storage.onChanged.addListener((changes, area) => {
    if(area === "sync" && changes.list) {
      const newList = changes.list.newValue;
      if (JSON.stringify(newList) !== JSON.stringify(list)) {
        console.log("List changed in sync :", newList);
        list = newList;
        clearList();
        list.forEach((item) => {
          addItemToDom(item);
        });
      }
    }
  });

  function saveList(list) {
    browser.storage.sync.set({ list: list }).then((data) => {
      console.log("List set in sync :", list);
    });
  }

  function removeItem(item) {
    list = list.filter(i => i.url !== item.url);
    saveList(list);
  }

  function isUrlInList(url) {
    return list.some(item => item.url === url);
  }

  function createElement(tagName, attributes = {}) {
    const element = document.createElement(tagName)
    for (const attribute in attributes) {
      element.setAttribute(attribute, attributes[attribute])
    }
    return element
  }

  function addItemToDom(item) {
    
    const li = createElement("li", {
      id: item.date,
    });

    const link = createElement("a", {
      class: "link-item",
      href: item.url,
    });

    const favicon = createElement("div", {
      class: "favicon",
    });

    const faviconImage = createElement("img", {
      src: `https://www.google.com/s2/favicons?domain=${item.url}&sz=32`,
    });

    favicon.appendChild(faviconImage);
    link.appendChild(favicon);

    const informations = createElement("div", {
      class: "informations",
    });

    const informationsTitle = createElement("div", {
      class: "title",
    });

    informationsTitle.textContent = item.title;
    informations.appendChild(informationsTitle);

    const informationsUrl = createElement("div", {
      class: "url",
    });

    informationsUrl.textContent = item.url;
    informations.appendChild(informationsUrl);

    link.appendChild(informations);
    li.appendChild(link);

    const deleteButton = createElement("button", {
      class: "delete",
    })

    deleteButton.textContent = 'Delete';
    li.appendChild(deleteButton);

    link.addEventListener('click', function(e) {
      if(e.ctrlKey || e.metaKey) { return; }
      e.preventDefault();
      browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
        browser.tabs.update(tabs[0].id, { url: item.url });
      });
    });

    deleteButton.addEventListener('click', function() {
      if (deleteButton.textContent === 'Confirm') {
        li.remove();
        removeItem(item);
      } else {
        deleteButton.textContent = 'Confirm';
        deleteButton.classList.add('confirmDelete');
        setTimeout(function() {
          deleteButton.textContent = 'Delete';
          deleteButton.classList.remove('confirmDelete');
        }, 4000);
      }
    });

    app.insertBefore(li, app.firstChild);

  }

  function clearList() {
    while(app.firstChild) {
      app.removeChild(app.firstChild);
    }
  }

  function filterItems(searchText = "") {
    currentSearchText = searchText.toLowerCase();
    list.forEach(item => {
      const element = document.getElementById(item.date);
      const result = item.title.toLowerCase().includes(currentSearchText) || item.url.toLowerCase().includes(currentSearchText);
      element.style.display = result ? "flex" : "none";
    });
  };

  addItem.addEventListener('click', function() {
    
    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
      const activeTab = tabs[0];
      if(isUrlInList(activeTab.url)) {
        removeItem(activeTab);
        document.querySelectorAll('.link-item').forEach(item => {
          if(item.href === activeTab.url) {
            item.parentElement.remove();
          }
        });
      }

      const item = {
        date: Date.now(),
        title: activeTab.title,
        url: activeTab.url
      }

      list.push(item);
      saveList(list);
      addItemToDom(item);

      // Apply the filter if there is an active search text
      if(currentSearchText) {
        filterItems(currentSearchText);
      }

    });

  });

  searchInput.addEventListener('input', function() {
    clearSearchButton.style.display = this.value ? "block" : "none";
    filterItems(this.value);
  });

  clearSearchButton.addEventListener('click', function() {
    searchInput.value = '';
    searchInput.focus();
    clearSearchButton.style.display = "none";
    filterItems();
  });

});