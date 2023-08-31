async function init() {
  // Populate form with settings
  const { settings = {} } = await getSettings();
  applySettingsToForm(settings)
  
  // Watch for changes to form values
  document.querySelectorAll("input").forEach(item => {
    item.addEventListener('click', formOnChangeHandler);
  });
}

function applySettingsToForm(settings) {
  document.querySelectorAll("input").forEach(item => {
    if (item.type === "checkbox") {
      item.checked = settings[item.id];
    } else if (item.type === "radio" && item.id === settings[item.name]) {
      item.checked = true;
    } else if (settings[item.id] !== undefined) {
      item.value = settings[item.id];
    }
  });
}

async function formOnChangeHandler(event) {
  const settings = (await getSettings())?.settings || {};
  let key = event.target.id;
  let value = event.target.value;
  if (event.target.type === "checkbox") {
    value = event.target.checked;
  } else if (event.target.type === "radio") {
    key = event.target.name;
  }
  settings[key] = value;
  await saveSettings(settings);
}

async function getSettings() {
  const result = await _getFromStorage("settings");
  // console.log("Settings", JSON.stringify(result));
  return result;
}

async function saveSettings(settings) {
  const data = { settings };
  await _setToStorage(data);
  const result = await _getFromStorage("settings");
}

init();