// GMAIL PARSE
const observer = new MutationObserver(async () => {
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
  const content = document.querySelector('.a3s.aiL').outerHTML;

  const result = await fetch('https://spot-me-app.tech/check', {
    method: 'POST',
    body: JSON.stringify({
      sender: email,
      subject: subject,
      content: content,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
  console.log(content);
  const data = await result.json();

  //return [email, subject, content];
  return data;
};

const showPopup = () => {};
