async function initCalendarAssignments() {
  await _waitForElement(".assignment-calendar-header");
  const { settings } = await _getFromStorage("settings");

  if (settings["optimize-columns"]) {
    await _waitForElement(".fc-scroller");
    document.querySelector(".fc-scroller").classList.add("optimize-columns");
   // Watch for changes to the table and update as needed
    _onSelectorChangeComplete(".fc-scroller", calendarAssignmentsTableChangeHandler);
  }

}

async function calendarAssignmentsTableChangeHandler() {
  await reviseAssignmentDates();
}

async function reviseAssignmentDates() {
  await _waitForElement(".fc-list-table");
  const elements = document.querySelectorAll('div.time');
  elements.forEach(element => {
    let value = element.innerText;
    // format the dates as 8/14 instead of Mon, Aug 14
    const newValue = value.replace(/(\w+), (\w+) (\d+)/g, (match, dayOfWeek, month, day) => {
      const date = new Date(`${month} ${day}`);
      const monthNumber = date.getMonth() + 1; // getMonth() returns 0-based month, so add 1
      return `${monthNumber}/${day}`;
    });
    element.innerText = newValue;
  })
}

function reformatDateString(input) {
  return input.replace(/(\w+), (\w+) (\d+)/g, (match, dayOfWeek, month, day) => {
      const date = new Date(`${month} ${day}`);
      const monthNumber = date.getMonth() + 1; // getMonth() returns 0-based month, so add 1
      return `${monthNumber}/${day}`;
  });
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

