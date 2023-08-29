async function init() {
  const { printSettings } = await getSettings();
  await removeExtraAssignments(printSettings);
  await removeExtraColumns(printSettings);
}

async function removeExtraAssignments(printSettings) {
  if (!printSettings["hide-non-homework"]) {
    return;
  }

  // When the setting is enabled add a class to the table
  await _waitForElement("#assignment-center-list-view table td");
  document.querySelector("#assignment-center-list-view").classList.add("hide-non-homework");

  // Find rows that need to be removed
  removeNonHomeworkRows();
}

function removeNonHomeworkRows() {
  const details =[...document.querySelectorAll(`#assignment-center-list-view table td[data-heading="Details"]`)];
  const cells = details.filter(detail => {
    // Find cells with content that is suspected to not be an assignement
    const professionalism = /^(?=.*Professionalism).*/ig.test(detail.innerText);
    const conduct = /^(?=.*Class conduct).*/ig.test(detail.innerText);
    const participation = /^(?=.*Class participation).*/ig.test(detail.innerText);
    return professionalism || conduct || participation;
  });

  // Add .hide class to those rows
  const rows = cells.map(cell => cell.parentElement);
  addClassToElements(rows, "hide");
}

async function removeExtraColumns(printSettings) {
  if (!printSettings["optimize-columns"]) {
    return;
  }

  // When the setting is enabled add a class to the table
  await _waitForElement("#assignment-center-list-view table td");
  document.getElementById("assignment-center-list-view").classList.add("optimize-columns");
  removeExtraClassNameInformation();
}

async function removeExtraClassNameInformation() {
  await _waitForElement("#assignment-center-list-view table td");
  const elements = document.querySelectorAll('[data-heading="Class"]');
  elements.forEach(element => {
    const value = element.innerText;
    const newValue = value.substring(0, value.indexOf(':'));
    element.innerText = newValue;
  })
}

function addClassToElements(elements, className) {
  const elementsArray = Array.isArray(elements) ? elements : [elements];
  elementsArray.forEach(element => {
    element?.classList.add(className);
  });
}

async function getSettings() {
  const result = await _getFromStorage("printSettings");
  return result;
}

function _getFromStorage(key) {
  return new Promise((resolve, reject) => {
    if (key != null) {
      chrome.storage.local.get(key, function (obj) {
        resolve(obj);
      });
    } else {
      reject(null);
    }
  });
}

function _waitForElement(selector, delay = 50, tries = 20) {
  const element = document.querySelector(selector);

  if (!window[`__${selector}`]) {
    window[`__${selector}`] = 0;
    window[`__${selector}__delay`] = delay;
    window[`__${selector}__tries`] = tries;
  }

  function _search() {
    return new Promise((resolve) => {
      window[`__${selector}`]++;
      setTimeout(resolve, window[`__${selector}__delay`]);
    });
  }

  if (element === null) {
    if (window[`__${selector}`] >= window[`__${selector}__tries`]) {
      window[`__${selector}`] = 0;
      return Promise.resolve(null);
    }

    return _search().then(() => _waitForElement(selector));
  } else {
    return Promise.resolve(element);
  }
}

init();