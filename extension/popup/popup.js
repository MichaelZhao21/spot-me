// Read in the list of links from the content script
// and display them in the popup
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   const links = request.links;
//   const linksList = document.getElementById('links');
//   links.forEach((link) => {
//     console.log('hey');
//     const li = document.createElement('li');
//     const a = document.createElement('a');
//     a.href = link;
//     a.innerText = link;
//     li.appendChild(a);
//     linksList.appendChild(li);
//   });
// });

chrome.runtime.onConnect.addListener((port) => {
  console.assert(port.name === 'channel');
  port.onMessage.addListener((message) => {
    console.log(message);
  });
});
