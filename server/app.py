from http import HTTPStatus, HTTPMethod

from flask import Flask, request
from flask_cors import CORS

BOOKS = [
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

BOOK_SCHEMA = {
    "title": str,
    "author": str,
    "read": bool
}

app = Flask(__name__)
app.config.from_object(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


def validate_book(incoming):
    if not sorted(list(incoming)) == sorted(list(BOOK_SCHEMA)):
        return False
    if not all(isinstance(incoming[key], BOOK_SCHEMA[key]) for key in list(BOOK_SCHEMA)):
        return False
    return True


@app.route("/ping", methods=["GET"])
def ping_pong():
    return {"message": "pong!"}


@app.route("/books", methods=[HTTPMethod.GET, HTTPMethod.POST])
def books_route():
    print(request.method)
    if request.method == HTTPMethod.GET:
        return {
            "status": "success",  # Auwei, is it going to report success even if
            "books": BOOKS
        }
    elif request.method == HTTPMethod.POST:
        if not validate_book(request.json):
            return {"status": "error", "message": "validation failed"}, HTTPStatus.BAD_REQUEST
        if request.json in BOOKS:
            return {"status": "error", "message": "book already in books"}, HTTPStatus.BAD_REQUEST
        BOOKS.append(request.json)
        return {
            "status": "success",
            "message": "Book added!"
        }


if __name__ == "__main__":
    app.run()
