// const email = document.querySelector('h3');
// const emailText = email.innerText;
// console.log(emailText);
document.body.onload = async () => {
  // Wait for h3 to load in DOM
  setTimeout(() => {
    console.log('test');
    const email = document.querySelectorAll('h3');
    //const emailText = email.innerText;
    console.log(email);
    var port = chrome.runtime.connect({ name: 'channel' });
    port.postMessage({ test: 'HELLO FROM CONTENT SCRIPT' });
  }, 4000);
};

// const linksArray = Array.from(links);
// const linksHrefs = linksArray.map((link) => link.href);
// console.log(linksHrefs);
// console.log('HELLO');
// chrome.runtime.sendMessage({ links: linksHrefs });
