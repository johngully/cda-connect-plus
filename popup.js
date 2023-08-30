async function init() {
  // Populate form with settings
  const { printSettings } = await getSettings();
  applySettingsToForm(printSettings)
  
  // Watch for changes to form values
  document.querySelectorAll("input").forEach(item => {
    item.addEventListener('click', formOnChangeHandler);
  });
}

function applySettingsToForm(printSettings) {
  document.querySelectorAll("input").forEach(item => {
    if (item.type === "checkbox") {
      item.checked = printSettings[item.id];
    } else {
      item.value = printSettings[item.id];
    }
  });
}

async function formOnChangeHandler(event) {
  const printSettings = (await getSettings())?.printSettings || {};
  let value = event.target.value;
  if (event.target.checked !== undefined) {
    value = event.target.checked;
  }
  printSettings[event.target.id] = value;
  await saveSettings(printSettings);
}

async function getSettings() {
  const result = await _getFromStorage("printSettings");
  // console.log("Settings", JSON.stringify(result));
  return result;
}

async function saveSettings(printSettings) {
  const data = { printSettings };
  await _setToStorage(data);
  // const result = await getFromStorage("printSettings");
}

init();