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

function _setToStorage(data) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(data, function (obj) {
      resolve(obj);
    });
  });
}

function _htmlToElement(html) {
  var template = document.createElement('template');
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

function _timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
