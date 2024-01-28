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

// The sender object has 3 levels. 1. good 2. maybe 3. bad, display the page on case basis

function load(data){
  let t = data
  console.log(t)
}

document.addEventListener("DOMContentLoaded", function () {
  load({
    "sender": {
      "level": 0, 
      "text": "string with the sender email",
      "description": "string describing what is bad if level > 0"
    },
    "subject": {
      "level": 0, 
      "text": "string with subject text",
      "description": "same as above"
    },
    "hyperlinks": {
      "level": 0, 
      "links": [
        { "display": "display link in email", "actual": "actual URL that it leads to" }
      ],
      "description": "same as above"
    }
  })
})

chrome.runtime.onConnect.addListener((port) => {
  
  console.assert(port.name === 'channel');
  port.onMessage.addListener((message) => {
    console.log(message);

  });
});
