async function init() {  
  await onUrlChange();
  handleUrlChanges();
}

function handleUrlChanges() {
  let lastUrl = location.href; 
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      onUrlChange();
    }
  }).observe(document, {subtree: true, childList: true});
}

async function onUrlChange() {
  const isAssigmentsPrintUrl = /\?pl=.*assignment-center$/.test(document.URL) || /\?pl=.*assignments$/.test(document.URL);
  const isAssignmentsUrl = /assignment-center$/.test(document.URL) || /assignments$/.test(document.URL);
  const isCalendarUrl = /#calendar/.test(document.URL)
  if (isAssigmentsPrintUrl) {
    initPrintFormat();
  } else if (isAssignmentsUrl) {
    initAssignments();
  } else if (isCalendarUrl) {
    await initCalendarAssignments();
  }
}

init();