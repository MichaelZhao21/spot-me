from flask import Flask, request
from flask_cors import CORS, cross_origin
from spellchecker import SpellChecker
from bs4 import BeautifulSoup
import re

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

spell = SpellChecker()

@app.route("/")
@cross_origin()
def hello_world():
    return {
        "message": "Hello, World!"
    }

@app.post("/check")
@cross_origin()
def check():
    req = request.get_json()
    sender = req['sender'] # string
    subject = req['subject'] # string
    content = req['content'] # string

    # Calculate the number of misspelled words in the subject
    subj_clean = ''.join(e.lower() for e in subject if e.isalnum() or e.isspace())
    subj_misspelled = spell.unknown(subj_clean.split())
    print("Words:", subj_clean)
    print("Mispelled:", subj_misspelled)
    subj_miscount = len(subj_misspelled)
    subj_total = len(subj_clean.split())
    subj_status = 0
    subj_error = None
    if subj_miscount > 3:
        subj_status = 1
        subj_error = "More than 3 misspelled words in subject"
    if subj_miscount / subj_total >= 0.5:
        subj_status = 2
        subj_error = "More than 50% of words misspelled in subject"

    # Count # of capitals in subject; if more than 50% of letters are capitals, flag
    subj_capitals = sum(1 for c in subject if c.isalpha() and c.isupper())
    print("Capitals:", subj_capitals)
    subj_letters = sum(1 for c in subject if c.isalpha())
    if subj_capitals / subj_letters > 0.5:
        subj_status = 1
        subj_error = "Too many capital letters in the subject"
    if subj_capitals / subj_letters > 0.75:
        subj_status = 2
        subj_error = "Way too many capital letters in the subject"

    # If any exclamations in subject, flag
    if '!' in subject:
        subj_status = 1
        print("Exclamation mark found in subject")
        subj_error = "Subject contains exclamation mark"
    if '!!' in subject:
        subj_status = 2
        print("2+ exclamation marks found in subject")
        subj_error = "Subject contains multiple exclamation marks"

    # If there are any sus words, flag (but if we are already at level 2, don't flag)
    if subj_status < 2:
        sus_words = ['invoice', 'new', 'message', 'required', 'file', 'request', 'action', 'document', 'verification', 'efax', 'vm', 'deal', 'free', 'guarantee', 'hidden', 'effective', 'limited', 'lifetime', 'lose', 'medium', 'now', 'payment', 'bill', 'debt', 'no subject']
        for word in sus_words:
            if word in subj_clean:
                subj_status = 1
                print("Sus word found in subject:", word)
                subj_error = "Subject contains suspicious word '" + word + "'" 
    
    # Extract sender
    x = re.findall(r'^(.*)\<(.*)\>', sender)
    if len(x) > 0:
        sender = x[0][0].strip()
        sender_email = x[0][1].strip()
    else:
        sender = sender.strip()
        sender_email = None

    # Check sender -- if > 2 periods, flag
    sender_status = 0
    sender_error = None
    if sender.count('.') > 2:
        sender_status = 2
        sender_error = "Sender contains more than 1 subdomain"

    # Extract hyperlinks
    soup = BeautifulSoup(content, 'html.parser')
    links = soup.find_all('a')
    hyperlinks = [{ "display": link.string if link.string is not None else "[No Text]", "actual": link.get('href') } for link in links]
    filtered_links = [link for link in hyperlinks if link['actual'] is not None]
    print("Hyperlinks:", len(filtered_links))

    # Sus hyperlinks
    hyper_status = 0
    hyper_error = None
    for link in filtered_links:
        display_origin = re.search(r'[a-zA-Z0-9\-]*\.[a-zA-Z0-9\-]*', link['display'])
        actual_origin = re.search(r'[a-zA-Z0-9\-]*\.[a-zA-Z0-9\-]*', link['actual'])
        if display_origin is not None and actual_origin is not None:
            if display_origin.group(0) != actual_origin.group(0):
                print("Suspicious hyperlink:", "Expected", link['display'], "; Got", link['actual'])
                hyper_status = 2
                hyper_error = "Hyperlink text url does not match actual url!"
                break

    # Get cum level
    cum_level = max(subj_status, max(subj_status, hyper_status))
    print("Cumulative Level:", cum_level)

    return {
        "cum_level": cum_level,
        "sender": {
            "level": sender_status, 
            "text": (sender_email + " (" + sender + ")") if sender_email is not None else sender,
            "description": sender_error,
        },
        "subject": {
            "level": subj_status,
            "text": subject,
            "description": subj_error,
        },
        "hyperlinks": {
            "level": hyper_status,
            "links": filtered_links,
            "description": hyper_error,
        }
    }

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
