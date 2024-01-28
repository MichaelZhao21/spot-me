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
  var pic = document.querySelector("img[src='../images/dude-bad.svg' ")
  switch(level){
    case 0:
      document.getElementById('header-text').innerHTML = "SAFE"
      pic.src = "../images/dude-good-green.svg" 
      break;
    case 1:
      document.getElementById('header-text').innerHTML = "CAUTION"
      pic.src = "../images/dude-maybe.svg" 
      break;
    case 2:
      document.getElementById('header-text').innerHTML = "SUSPICIOUS"
      pic.src = "../images/dude-bad.svg" 
      break;
    
  }

  // -- UPDATE SENDER SECTION --

  if(senderLevel === 0){
    document.getElementById('sender-sec').style.display = "none"
  } else {

    // change email
    senderEmail = t.sender.text
    document.getElementById('sender-email').innerHTML = senderEmail
    // change description
    senderText = t.sender.description
    document.getElementById('sender-text').innerHTML = senderText

    if(senderLevel === 2){
      document.getElementById('sender-sec').classList.add("two")
      document.getElementById('sender-sec').classList.add("two-stay")
    } else {
      document.getElementById('sender-sec').classList.add("one")
    }
  }


  // -- UPDATE SUBJECT SECTION --
  if(subjectLevel === 0){
    document.getElementById('subject-sec').style.display = "none"
  } else {
    

    // change text
    subjectText = t.subject.text
    document.getElementById('subject-text').innerHTML = subjectText
  
    // change description
    subjectDescription = t.subject.description
    document.getElementById('subject-desc').innerHTML = subjectDescription

    if(subjectLevel === 2){
      console.log("yes")
      document.getElementById('subject-sec').classList.add("two")
      document.getElementById('subject-sec').classList.add("two-stay")
    } else {
      document.getElementById('subject-sec').classList.add("one")
    }
  }

  // -- UPDATE HYPERLINKS SECTION -- 

  if(linksLevel === 0) {
    document.getElementById('links-sec').style.display = "none"
  } else {
    
    // update display link
    linkDisplay = t.hyperlinks.links[0].display
    document.getElementById('link-display').innerHTML = linkDisplay
    console.log(linksLevel)
    // update real link
    linkReal = t.hyperlinks.links[0].actual
    document.getElementById('link-real').innerHTML = linkReal

    console.log(linksLevel)
    if(linksLevel === 2){
      document.getElementById('links-sec').classList.add("two")
      document.getElementById('links-sec').classList.add("two-stay")
      
    } else {
      document.getElementById('links-sec').classList.add("one")
    }
  }

}

document.addEventListener("DOMContentLoaded", function () {
  load({
    "sender": {
      "level": 2, 
      "text": "sender@email",
      "description": "string describing what is bad if level > 0"
    },
    "subject": {
      "level": 0, 
      "text": "string with subject text",
      "description": "same as above"
    },
    "hyperlinks": {
      "level": 1, 
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
