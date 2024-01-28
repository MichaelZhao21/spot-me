document.addEventListener('DOMContentLoaded', () => {
  document.body.textContent = 'Loading...';
});

chrome.runtime.onConnect.addListener((port) => {
  console.assert(port.name === 'channel');
  port.onMessage.addListener((message) => {
    console.log(message);
    document.body.textContent = message.sender;
  });
});
