function init() {  
  onUrlChange();
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

function onUrlChange() {
  const isAssignmentsUrl = /^(?!.*\?pl.*\/assignments$)/.test(document.URL)
  if (isAssignmentsUrl) {
    initAssignments();
  }
}

init();