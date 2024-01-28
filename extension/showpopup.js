const showPopup = (data) => {
  const popup = document.createElement('div');
  const styling = document.createElement('style');

  const url = chrome.runtime.getURL('');

  const html = `{POPUP_HTML}`;
  const css = `{POPUP_CSS}`;

  styling.id = 'spot-me-styling';

  popup.innerHTML = html.replace(/\.\.\/images/g, url + 'images');
  styling.innerHTML = css.replace(/\.\.\/fonts/g, url + 'fonts');

  document.body.appendChild(styling);
  document.body.appendChild(popup);

  // Run the JS after everything gets injected in the page

  {POPUP_JS}

  // Add the mutation listener and listen for email changes
  const observer2 = new MutationObserver(async () => {
    if (
      document.querySelector('h2.hP') &&
      document.querySelector('h2.hP').textContent !== data.subject.text
    ) {
      observer2.disconnect();
      if (popup) popup.remove();
      arr = await getEmail();
      showPopup(arr);
    }

    if (
      !document.querySelector('h2.hP') &&
      document.getElementById('spot-me-popup')
    ) {
      if (popup) popup.remove();
    }

    // if (
    //   document.getElementById(':1k') &&
    //   document.getElementById(':1k').offsetParent
    // ) {
    //   if (popup) popup.remove();
    // }
  });
  observer2.observe(document.body, {
    childList: true,
    subtree: true,
  });
};
