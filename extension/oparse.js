// OUTLOOK PARSE
const observer = new MutationObserver(async () => {
  if (
    document.querySelector('.o4zjZ.ookyc') &&
    document.querySelector('.D3zfd.XxeQL') &&
    document.getElementById('UniqueMessageBody')
  ) {
    console.log('found');
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
  const email = document.querySelector('.o4zjZ.ookyc').textContent;
  const subject = document.querySelector('.D3zfd.XxeQL').textContent;
  const content = document.getElementById('UniqueMessageBody').outerHTML;

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
