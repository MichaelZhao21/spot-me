let observer = new MutationObserver(async (mutations) => {
  console.log('mut');
  if (
    document.querySelector('.gE.iv.gt') &&
    document.querySelector('h2.hP') &&
    document.querySelector('.a3s.aiL')
  ) {
    observer.disconnect();
    arr = await getEmail();
    showPopup(arr);
  }
});
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

const getEmail = async () => {
  const email = document.querySelector('.gE.iv.gt').textContent;
  const subject = document.querySelector('h2.hP').textContent;
  const content = document.querySelector('.a3s.aiL').textContent;
  return [email, subject, content];
  //var port = chrome.runtime.connect({ name: 'channel' });
  //port.postMessage({ sender: email, subject: subject, content: content });
};

const showPopup = (data) => {
  const popup = document.createElement('div');
  popup.id = 'popup';
  console.log(data);
  popup.style = `
    position: fixed;
    top: 0;
    left: 0;
    width: 200px;
    height: 100%;
    background-color: white;`;
  popup.innerHTML = `
    <h1>Pop up thingy</h1>
    <p>${data[0]}</p>
    <p>${data[1]}</p>
    <p>${data[2]}</p>

    `;
  document.body.appendChild(popup);
};
