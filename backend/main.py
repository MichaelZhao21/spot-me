from flask import Flask, request
from spellchecker import SpellChecker

app = Flask(__name__)
spell = SpellChecker()

@app.route("/")
def hello_world():
    return {
        "message": "Hello, World!"
    }

@app.post("/check")
def check():
    req = request.get_json()
    sender = req['sender'] # string
    subject = req['subject'] # string
    content = req['content'] # string

    subject_clean = ''.join(e.lower() for e in subject if e.isalnum())

    misspelled_subject = spell.unknown(subject.split())
    return {
        "ok": 1,
        "misspelled_subject": list(misspelled_subject),
    }

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
