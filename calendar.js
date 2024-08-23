let loaded = false;
let _observer;
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
  console.log("calendarAssignmentsTableChangeHandler")
  if (loaded) {
    return;
  }
  
  loaded = true; // Set the loaded flag so that modifications to the childrend don't cause a seletor change
  await reviseAssignmentDates();
  addDownloadLinks();
}

async function addDownloadLinks() {
  const assignments = document.querySelectorAll('table.list-event-table-fc');

  console.log(`Assignments: ${assignments.length}`);
  
  // NOTE: This loop will not await the completion of the previous increment
  //       Using assignments.forEach instead of for (const assignment of assignments)
  //       allows the requests to be made in parallel
  assignments.forEach(async (assignment) => {
    let assignmentDetailUrl = assignment.querySelector("a.detail-link")?.getAttribute('href');
    if (!assignmentDetailUrl) return;
    const assignmentDetails = await getAssignmentDetails(assignmentDetailUrl)
    const downloadLinks = getAssignmentDownloadsLinks(assignmentDetails.DownloadItems);
    if (!downloadLinks) return;
    const assignmentElement = assignment.querySelector("tbody tr > td:nth-child(3)");
    if (!assignmentElement) return;
    assignmentElement.append(downloadLinks);
  });
}

function getAssignmentDownloadsLinks(downloads) {
  const links = downloads.map(download => `<a href="${download.DownloadUrl}" class="assignment-download-link" target="_blank">${download.ShortDescription}</a>`);
  if (links.length) {
    const elements = _htmlToElement(`<div class="assignment-downloads"><div>Downloads</div>${links.join('')}</div>`);
    return elements;  
  } else {
    return;
  }
}

async function getAssignmentDetails(assignmentDetailUrl) {
  const assignmentId = getAssignmentAndStudentIdFromAssignmentDetailUrl(assignmentDetailUrl);
  const url = document.querySelector("a#mobile-profile-link")?.href;
  const studentId = getStudentIdFromProfileUrl(url);
  const assignmentDetailsApiUrl = `/api/assignment2/UserAssignmentDetailsGetAllStudentData?assignmentIndexId=${assignmentId}&studentUserId=${studentId}&personaId=1`;  
  const assignmentDetails = await fetchJson(assignmentDetailsApiUrl);
  return assignmentDetails;
}

function getStudentIdFromProfileUrl(url) {
  const parts = url.split('/');
  const studentId = parts[parts.length - 2];
  return studentId;
}

function getAssignmentAndStudentIdFromAssignmentDetailUrl(url) {
  // Split the URL by slashes
  const parts = url.split('/');
  const mode = url.includes("assignment-student-view") ? "student" : "parent";
  const assignmentId = mode === "parent" ? parts[parts.length - 2] : parts[parts.length - 1];
  return assignmentId;
}

// async function getDocumentFromUrl(relateiveUrl) {
//   const origin = window.location.origin;
//   const url = new URL(relateiveUrl, origin).href;
//   const result = await fetch(url);
//   const parser = new DOMParser();
//   const doc = parser.parseFromString(result, 'text/html');
//   return doc;
// }

async function fetchJson(url, isRelative = true) {
  try {
    const fullyQualifiedUrl = isRelative ? new URL(url, window.location.origin).href : url;
    const result = await fetch(fullyQualifiedUrl);
    const resultJson = await result.json();
    return resultJson;
  } catch (error) {
    console.error(error);
  }
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

