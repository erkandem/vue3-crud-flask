from flask import Flask, jsonify
from flask_cors import CORS


def get_books():
    """mimicking our database"""
    return [
        {
            "title": "On the Road",
            "author": "Jack Kerouac",
            "read": True
        },
        {
            "title": "Harry Potter and the Philosopher's Stone",
            "author": "J. K. Rowling",
            "read": False
        },
        {
            "title": "Green Eggs and Ham",
            "author": "Dr. Seuss",
            "read": True
        }
    ]


app = Flask(__name__)
app.config.from_object(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route("/ping", methods=["GET"])
def ping_pong():
    return jsonify(message="pong!")


@app.route("/books", methods=["GET"])
def books_route():
    return jsonify({
        "status": "success",  # Auwei, is it going to report success even if 
        "books": get_books()  # get_books fails?
    })


if __name__ == "__main__":
    app.run()
