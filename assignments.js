async function initAssignments() {
  await _waitForElement(".assignment-calendar-header");
  const settings = { schedule: "monday" };
  const days = calculateDays(settings);
  setupDayOfWeekButtons(days);

  const todayElement = days.todayIsDay1 ? document.getElementById("day1") : document.getElementById("day2");
  dayChange(todayElement);
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
    <label name="test" class="btn btn-default"><input type="radio" id="day1Before" name="dayofweek" autocomplete="off" value="${days.day1Before.toString('MM-dd-yyyy')}" />${days.day1Before.toString("M/d")}</label>
    <label name="test" class="btn btn-default"><input type="radio" id="day2Before" name="dayofweek" autocomplete="off" value="${days.day2Before.toString('MM-dd-yyyy')}" />${days.day2Before.toString("M/d")}</label>
    <label name="test" class="btn btn-default ${day1Active}"><input type="radio" id="day1" name="dayofweek" autocomplete="off" value="${days.day1.toString('MM-dd-yyyy')}" />${days.day1.toString("M/d")}</label>
    <label name="test" class="btn btn-default ${day2Active}"><input type="radio" id="day2" name="dayofweek" autocomplete="off" value="${days.day2.toString('MM-dd-yyyy')}" />${days.day2.toString("M/d")}</label>
    <label name="test" class="btn btn-default"><input type="radio" id="day1After" name="dayofweek" autocomplete="off" value="${days.day1After.toString('MM-dd-yyyy')}" />${days.day1After.toString("M/d")}</label>
    <label name="test" class="btn btn-default"><input type="radio" id="day2After" name="dayofweek" autocomplete="off" value="${days.day2After.toString('MM-dd-yyyy')}" />${days.day2After.toString("M/d")}</label>
  </div>
  `);
  
  // Locate the postiion to insert the date selections
  const insertPosition = document.getElementsByClassName("assignment-calendar-header")[0].children[2].firstElementChild.lastElementChild;
  insertPosition.appendChild(dayFilters);

  // Add click events to the labels
  // Adding change events to the radio inputs didn't work for some reason
  document.getElementsByName("test").forEach(dayElement => {
    dayElement.addEventListener("click", event => { dayChange(event.target.firstChild); });
  });
}

function dayChange(input) {
  const day = new Date(input.value);
  const dateRange = calculateDateRange(day);
  setRange(dateRange);
}

function calculateDateRange(day) {
  const range = {
    startDate: day.addDays(1).toString("MM/dd/yyyy"),
    endDate: day.addDays(5).toString("MM/dd/yyyy")
  }
  return range;
} 

function setRange(dateRange) {
  const startDateInput = document.getElementById("range-start-date");
  const endDateInput = document.getElementById("range-end-date");
  setValue(startDateInput, dateRange.startDate);
  setValue(endDateInput, dateRange.endDate);
}

function setValue(element, value) {
  element.setAttribute("value", value);
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.dispatchEvent(new Event('blur', { bubbles: true }));
}
