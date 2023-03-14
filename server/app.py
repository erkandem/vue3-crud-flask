from http import HTTPStatus, HTTPMethod
from uuid import uuid4
from flask import Flask, request
from flask_cors import CORS

BOOKS = [
        {
            "id": str(uuid4()),
            "title": "On the Road",
            "author": "Jack Kerouac",
            "read": True
        },
        {
            "id": str(uuid4()),
            "title": "Harry Potter and the Philosopher's Stone",
            "author": "J. K. Rowling",
            "read": False
        },
        {
            "id": str(uuid4()),
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

BOOK_SCHEMA_PUT = {
    "id": {"type": str, "required": False},
    "title": {"type": str, "required": True},
    "author": {"type": str, "required": True},
    "read": {"type": bool, "required": True},
}

app = Flask(__name__)
app.config.from_object(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


def validate_put_book(incoming):
    if not isinstance(incoming, dict):
        return False
    required_keys = [field for field in BOOK_SCHEMA_PUT if BOOK_SCHEMA_PUT[field]["required"]]
    not_required_keys = [field for field in BOOK_SCHEMA_PUT if not BOOK_SCHEMA_PUT[field]["required"]]
    if any(key for key in incoming if key not in BOOK_SCHEMA_PUT):
        return False
    for key in required_keys:
        if key not in incoming:
            return False
        if not isinstance(incoming[key], BOOK_SCHEMA_PUT[key]["type"]):
            return False
    for key in not_required_keys:
        if key in incoming:
            if not isinstance(incoming[key], BOOK_SCHEMA_PUT[key]["type"]):
                return False
    return True


def validate_book(incoming):
    if not isinstance(incoming, dict):
        return False
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


@app.route("/books/<string:book_id>", methods=["PUT"])
def book_route(book_id):
    if book_id not in [x["id"] for x in BOOKS]:
        return {"status": "error", "message": "Book not in DB."}, HTTPStatus.BAD_REQUEST
    if validate_put_book(request.json):
        # yes, this is O(n). in reality, we would hit a hash O(0) instead of this data structure
        ind = [ind for ind, book in enumerate(BOOKS) if book["id"] == book_id][0]
        data = request.json
        data.update({"id": book_id})  # TODO: add read-only flag to schema
        BOOKS[ind] = data
        return {"status": "success", "message": "Updated book."}, 200
    # TODO: should add a more specific reason why the validation failed
    #       I'm so spoiled and should be thankful to django rest framework
    return {"status": "error", "message": "Validation failed."}, HTTPStatus.BAD_REQUEST


if __name__ == "__main__":
    app.run()
