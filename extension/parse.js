

let observer = new MutationObserver((mutations) => {
  console.log('mut');
  if (document.querySelector('h3')) {
    observer.disconnect();
    getEmail();
  }
});
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

const getEmail = async () => {
  const email = document
    .querySelector('.gE.iv.gt')
    .querySelectorAll('span')[4].textContent;
  const subject = document.querySelector('h2.hP').textContent;
  const content = document.querySelector('.a3s.aiL').textContent;
  console.log(email);
  var port = chrome.runtime.connect({ name: 'channel' });
  port.postMessage({ sender: email, subject: subject, content: content });
};
