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

function checkLevel(senderLevel, subjectLevel, linksLevel){
  let level = 0

  // check sender
  if(senderLevel >= subjectLevel && senderLevel >= linksLevel){
    level = senderLevel
  }
  // check subject
  if(subjectLevel >= senderLevel && subjectLevel >= linksLevel){
    level = subjectLevel
  } else {
    level = linksLevel
  }

    return level
}

function load(data){
  let t = data
  console.log(t)
  senderLevel = t.sender.level
  subjectLevel = t.subject.level
  linksLevel = t.hyperlinks.level
  level = checkLevel(senderLevel, subjectLevel, linksLevel)

  // -- UPDATE HEADER --
  const pic = document.getElementById('header-dude');
  switch(level){
    case 0:
      document.getElementById('header-text').innerHTML = "Safe Email"
      document.getElementById('header-desc').innerHTML = "This email should be safe."
      pic.src = "../images/dude-good-green.svg" 
      break;
    case 1:
      document.getElementById('header-text').innerHTML = "Suspicious..."
      document.getElementById('header-desc').innerHTML = "Be careful with this email; it may be suspicious."
      pic.src = "../images/dude-maybe.svg" 
      break;
    case 2:
      document.getElementById('header-text').innerHTML = "Dangerous!"
      document.getElementById('header-desc').innerHTML = "This email is a SCAM or a PHISHING EMAIL!"
      pic.src = "../images/dude-bad.svg" 
      break;
    
  }

  // -- UPDATE SENDER SECTION --

  // change email
  senderEmail = t.sender.text
  document.getElementById('sender-email').innerHTML = senderEmail
  // change description
  senderText = t.sender.description
  document.getElementById('sender-text').innerHTML = senderText


  // -- UPDATE SUBJECT SECTION --

  // change text
  subjectText = t.subject.text
  document.getElementById('subject-text').innerHTML = subjectText

  // change description
  subjectDescription = t.subject.description
  document.getElementById('subject-desc').innerHTML = subjectDescription

  // -- UPDATE HYPERLINKS SECTION -- 

  // update display link
  const linkDisplay = document.getElementById('link-display');

  t.hyperlinks.links.forEach((link) => {
    const dl = document.createElement('p');
    dl.innerHTML = link.display;
    dl.className = 'base link-d';
    linkDisplay.appendChild(dl);

    const rl = document.createElement('p');
    rl.innerHTML = link.actual;
    rl.className = 'base link-a';
    linkDisplay.appendChild(rl);
  });

  document.getElementById('link-desc').innerHTML = t.hyperlinks.description;
}

document.addEventListener("DOMContentLoaded", function () {
  load({
    "sender": {
      "level": 0, 
      "text": "sender@email",
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
