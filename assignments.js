let _settings;

async function initAssignments() {
  _settings = await getSettings();
  await _waitForElement(".assignment-calendar-header");
  const { settings } = await _getFromStorage("settings");
  const days = calculateDays(settings);
  setupDayOfWeekButtons(days);

  const todayElement = days.todayIsDay1 ? document.getElementById("day1") : document.getElementById("day2");
  setDay(todayElement);

  // Watch for changes to the table and update as needed
  _onSelectorChangeComplete("#assignment-center-list-view table", assignmentTableChangeHandler);
}

async function getSettings() {
  const settings = await _getFromStorageByKey("settings");
  return settings;
}

function toggleVisibilityHandler(event) {
  const row = this.parentElement;
  toggleRowVisibility(row);
  // Save the assignments with their visibility status
  // so that they can be referenced later for paging or print
  saveAssignments();
}

function toggleRowVisibility(row) {
  isVisible = row.classList.contains("show-print");
  setRowVisibility(row, !isVisible);
}

function setRowVisibility(row, isVisible = true) {
  if (isVisible) {
    row.classList.replace("hide-print", "show-print");
  } else {
    row.classList.replace("show-print", "hide-print");
  } 
}

async function saveAssignments() {
  const assignmentRows = [...document.querySelectorAll("#assignment-center-assignment-items tr")];
  const currentAssignments = assignmentRows.map(rowToAssignment);
  await _setToStorage({ currentAssignments });
}

function assignmentTableChangeHandler() {
  setupVisibilityColumn();
  setupAssignmentVisibility();
}

function setupVisibilityColumn() {
  // Add a column header if it does not exist
  const printHeader = document.querySelectorAll("#assignment-center-list-view #print-header").length;
  if (!printHeader) {
    const assignmentHeaderRows = document.querySelectorAll("#assignment-center-list-view table thead tr");
    assignmentHeaderRows.forEach(row => { row.insertAdjacentHTML(`afterbegin`, `<td id="print-header"></td>`); });
  }

  // Add a column if it does not exist
  const printData = document.querySelectorAll(`#assignment-center-assignment-items tr [data-heading="Print"]`).length;
  if (!printData) {
    const assignmentRows = document.querySelectorAll("#assignment-center-assignment-items tr");
    assignmentRows.forEach(row => {
      const td = document.createElement("td");
      td.setAttribute("data-heading", "Print")
      td.onclick = toggleVisibilityHandler;
      row.prepend(td);
      row.classList.add("hide-print"); // Set the initial state a hidden since it will be flipped the 1st time through
    });
  }
}

async function setupAssignmentVisibility() {
  const savedAssignments = await _getFromStorageByKey("currentAssignments");
  const assignmentRows = [...document.querySelectorAll("#assignment-center-assignment-items tr")];
  assignmentRows.forEach(row => {
    const isVisible = getRowVisibilty(row, savedAssignments);
    setRowVisibility(row, isVisible);
  });
}

function getRowVisibilty(row, saveAssignments) {
  const rowAssignment = rowToAssignment(row);
  const defaultVisibility = getDefaultVisibility(rowAssignment);
  const savedVisibility = getSavedVisibility(saveAssignments, rowAssignment);
  const isVisible = (savedVisibility === undefined) ? defaultVisibility : savedVisibility;
  return isVisible;
}

function getDefaultVisibility(assignment) {
  if (!_settings["hide-non-homework"]) {
    return true;
  }

  let isVisible = true;
  if (assignment.type === "Participation" || assignment.type === "Classwork") {
    isVisible = false;
  }
  return isVisible;
}

function getSavedVisibility(savedAssignments, assignment) {
  const savedAssignment = savedAssignments.find(savedAssignment => savedAssignment.hashId === assignment.hashId);
  return savedAssignment?.show;
}

function assignmentRowComparer(assignment, row) {
  const rowAssignment = rowToAssignment(row);
  const isSame = rowAssignment.hashId === assignment.hashId;
  return isSame;
}

function rowToAssignment(row) {
  const assignment = {
    class: row.querySelector(`td[data-heading="Class"]`).textContent,
    type: row.querySelector(`td[data-heading="Type"]`).textContent,
    details: row.querySelector(`td[data-heading="Details"]`).textContent,
    assign: row.querySelector(`td[data-heading="Assign"]`).textContent,
    due: row.querySelector(`td[data-heading="Due"]`).textContent
  };
  assignment.hashId = objectHash.sha1(assignment);
  assignment.show = row.classList.contains("show-print");
  return assignment;
}

function calculateDays(settings) {
  const days = {};

  if (settings.schedule === "monday") {
    days.day1Before = Date.monday().last().monday();
    days.day2Before = Date.wednesday().last().wednesday();
    days.day1 = Date.monday();
    days.day2 = Date.wednesday();
    days.day1After = Date.monday().next().monday();
    days.day2After = Date.wednesday().next().wednesday();
  } else {
    days.day1Before = Date.tuesday().last().tuesday();
    days.day2Before = Date.thursday().last().thursday();
    days.day1 = Date.tuesday();
    days.day2 = Date.thursday();
    days.day1After = Date.tuesday().next().tuesday();
    days.day2After = Date.thursday().next().thursday();
  }

  if (Date.today().compareTo(days.day2) >= 0) {
    days.todayIsDay2 = true;
  } else {
    days.todayIsDay1 = true;
  }

  return days;
}

function setupDayOfWeekButtons(days) {
  const day1Active = days.todayIsDay1 ? "active" : "";
  const day2Active = days.todayIsDay2 ? "active" : "";
  
  const dayFilters = _htmlToElement(`
  <div id="dayFilters" class="btn-group btn-group-sm views-button pull-right" data-toggle="buttons">
    <label name="dayofweek" class="btn btn-default"><input type="radio" id="day1Before" autocomplete="off" value="${days.day1Before.toString('MM-dd-yyyy')}" />${days.day1Before.toString("M/d")}</label>
    <label name="dayofweek" class="btn btn-default"><input type="radio" id="day2Before" autocomplete="off" value="${days.day2Before.toString('MM-dd-yyyy')}" />${days.day2Before.toString("M/d")}</label>
    <label name="dayofweek" class="btn btn-default ${day1Active}"><input type="radio" id="day1" autocomplete="off" value="${days.day1.toString('MM-dd-yyyy')}" />${days.day1.toString("M/d")}</label>
    <label name="dayofweek" class="btn btn-default ${day2Active}"><input type="radio" id="day2" autocomplete="off" value="${days.day2.toString('MM-dd-yyyy')}" />${days.day2.toString("M/d")}</label>
    <label name="dayofweek" class="btn btn-default"><input type="radio" id="day1After" autocomplete="off" value="${days.day1After.toString('MM-dd-yyyy')}" />${days.day1After.toString("M/d")}</label>
    <label name="dayofweek" class="btn btn-default"><input type="radio" id="day2After" autocomplete="off" value="${days.day2After.toString('MM-dd-yyyy')}" />${days.day2After.toString("M/d")}</label>
  </div>
  `);
  
  // Locate the postiion to insert the date selections
  const insertPosition = document.getElementsByClassName("assignment-calendar-header")[0].children[2].firstElementChild.lastElementChild;
  insertPosition.appendChild(dayFilters);

  // Add click events to the labels
  // Adding change events to the radio inputs didn't work for some reason
  document.getElementsByName("dayofweek").forEach(dayElement => {
    dayElement.addEventListener("click", event => { setDay(event.target.firstChild); });
  });
}

async function setDay(input) {
  const day = new Date(input.value);
  const dateRange = calculateDateRange(day);
  await setRange(dateRange);
}

function calculateDateRange(day) {
  const range = {
    startDate: day.addDays(1).toString("MM/dd/yyyy"),
    endDate: day.addDays(5).toString("MM/dd/yyyy")
  }
  return range;
} 

async function setRange(dateRange) {
  const startDateInput = document.getElementById("range-start-date");
  const endDateInput = document.getElementById("range-end-date");
  await setValue(startDateInput, dateRange.startDate);
  await setValue(endDateInput, dateRange.endDate);  
}

async function setValue(element, value) {
  element.setAttribute("value", value);
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.dispatchEvent(new Event('blur', { bubbles: true }));
  await _timeout(20); // Add this delay to ensure that the CDA connect code has time to process.
}
