from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    return {
        "message": "Hello, World!"
    }

@app.route("/check")
def check():
    return {
        "ok": 1,
    }

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)