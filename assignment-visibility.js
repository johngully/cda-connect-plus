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
  if (!_settings || !_settings["hide-non-homework"]) {
    return true;
  }

  let isVisible = true;
  if (assignment.type === "Participation" || assignment.type === "Professionalism" || assignment.type === "Classwork") {
    isVisible = false;
  }

  const professionalism = /^(?=.*Professionalism).*/ig.test(assignment.details);
  const conduct = /^(?=.*Class conduct).*/ig.test(assignment.details);
  const participation = /^(?=.*Class participation).*/ig.test(assignment.details);
  const culture = /^(?=.*Classroom Culture).*/ig.test(assignment.details);

  if (professionalism || conduct || participation || culture) {
    visible = false;
  }
  
  return isVisible;
}

function getSavedVisibility(savedAssignments, assignment) {
  const savedAssignment = savedAssignments.find(savedAssignment => savedAssignment.hashId === assignment.hashId);
  return savedAssignment?.show;
}

function rowToAssignment(row) {
  const assignment = {
    class: row.querySelector(`td[data-heading="Class"]`)?.innerText,
    type: row.querySelector(`td[data-heading="Type"]`)?.innerText,
    details: row.querySelector(`td[data-heading="Details"]`)?.innerText.split('\n', 1)[0].replace(/\s/g, ''),
    assign: row.querySelector(`td[data-heading="Assign"]`)?.innerText,
    due: row.querySelector(`td[data-heading="Due"]`)?.innerText
  };
  assignment.hashId = objectHash.sha1(assignment);
  assignment.show = row.classList.contains("show-print");
  return assignment;
}

function setRowVisibility(row, isVisible = true) {
  if (isVisible) {
    row.classList.replace("hide-print", "show-print");
  } else {
    row.classList.replace("show-print", "hide-print");
  } 
}
