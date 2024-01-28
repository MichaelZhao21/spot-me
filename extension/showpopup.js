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
};
