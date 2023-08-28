async function init() {
  // Wait for the data to be loaded
  await removeExtraClassNameInformation();
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