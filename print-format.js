let _settingsPrint;

async function initPrintFormat() {
  _settingsPrint = await getSettings();
  _settings = await getSettings();
  await removeExtraAssignments(_settingsPrint);
  await removeExtraColumns(_settingsPrint);
}

async function removeExtraAssignments(settings) {
  if (!settings["hide-non-homework"]) {
    return;
  }

  // When the setting is enabled add a class to the table and each row
  await _waitForElement("#assignment-center-list-view table td");
  document.querySelector("#assignment-center-list-view").classList.add("hide-non-homework");
  const assignmentRows = [...document.querySelectorAll("#assignment-center-assignment-items tr")];
  assignmentRows.forEach(row => row.classList.add("show-print"));

  // Find rows that need to be removed
  await setupAssignmentVisibility()
}

async function removeExtraColumns(settings) {
  if (!settings["optimize-columns"]) {
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
  const settings = await _getFromStorageByKey("settings");
  return settings;
}
