const fs = require('fs');

const re = /\<div id=\"spot-me-popup\"\>.*\<\/div\>/s;

const divCss = `
#spot-me-popup {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    width: 400px;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: white;
    filter: drop-shadow(0px 5px 3px #AAAAAAAA);
    border-radius: 5px;
    padding: 15px;
    max-height: 600px;
}
`;

function build() {
    // Create the dist folder if it doesn't exist
    if (!fs.existsSync('./dist')) {
        fs.mkdirSync('./dist');
    }

    // Copy over unchanged files for the extension
    fs.cpSync('./fonts', './dist/fonts', { recursive: true });
    fs.cpSync('./images', './dist/images', { recursive: true });
    fs.copyFileSync('./manifest.json', './dist/manifest.json');

    // Read in base js files
    let showPopup = fs.readFileSync('./showpopup.js', 'utf8');
    let parse = fs.readFileSync('./parse.js', 'utf8');
    let oparse = fs.readFileSync('./oparse.js', 'utf8');

    // Read in popup files
    const popupHTML = fs.readFileSync('./popup/popup.html', 'utf8');
    const popupCSS = fs.readFileSync('./popup/popup.css', 'utf8');
    const popupJS = fs.readFileSync('./popup/popup.js', 'utf8');

    // Modify the HTML to match the regex
    const popupHTMLCut = popupHTML.match(re)[0];

    // Modify the JS to remove everything after "document.addEventListener"
    const popupJSCut = popupJS.split('document.addEventListener')[0] + "load(data);";
    const popupJSMod = popupJSCut.replace(/\"\.\.\/images\//g, 'url + "images/')

    // Modify the CSS to include the divCss
    const popupCSSFull = popupCSS + divCss;

    // Replace all placeholders
    showPopup = showPopup.replace('{POPUP_HTML}', popupHTMLCut);
    showPopup = showPopup.replace('{POPUP_CSS}', popupCSSFull);
    showPopup = showPopup.replace('{POPUP_JS}', popupJSMod);

    parse = parse.replace('const showPopup = () => {};', showPopup);
    oparse = oparse.replace('const showPopup = () => {};', showPopup);

    // Write the new parse.js and oparse.js files
    fs.writeFileSync('./dist/parse.js', parse);
    fs.writeFileSync('./dist/oparse.js', oparse);
}

build();