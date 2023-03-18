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


def get_book_ind(book_id: str) -> int:
    """Assumes that the passed `book_id` is present in `BOOKS` """
    return [ind for ind, book in enumerate(BOOKS) if book["id"] == book_id][0]


BOOK_SCHEMA_POST = {
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
    if not sorted(list(incoming)) == sorted(list(BOOK_SCHEMA_POST)):
        return False
    if not all(isinstance(incoming[key], BOOK_SCHEMA_POST[key]) for key in list(BOOK_SCHEMA_POST)):
        return False
    return True


@app.route("/ping", methods=[HTTPMethod.GET])
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


@app.route("/books/<string:book_id>", methods=[HTTPMethod.PUT, HTTPMethod.DELETE])
def book_route(book_id):
    is_not_in_database = book_id not in [x["id"] for x in BOOKS]
    if request.method == HTTPMethod.PUT:
        if is_not_in_database:
            return {"status": "error", "message": "Book not in DB."}, HTTPStatus.BAD_REQUEST
        if validate_put_book(request.json):
            # yes, this is O(n). in reality, we would hit a hash O(0) instead of this data structure
            ind = get_book_ind(book_id)
            data = request.json
            data.update({"id": book_id})  # TODO: add read-only flag to schema
            BOOKS[ind] = data
            return {"status": "success", "message": "Updated book."}, 200
        # TODO: should add a more specific reason why the validation failed
        #       I'm so spoiled and should be thankful to django rest framework
        return {"status": "error", "message": "Validation failed."}, HTTPStatus.BAD_REQUEST
    elif request.method == HTTPMethod.DELETE:
        if is_not_in_database:
            return '', HTTPStatus.NOT_FOUND
        else:
            ind = get_book_ind(book_id)
            BOOKS.pop(ind)
            return '', HTTPStatus.NO_CONTENT


if __name__ == "__main__":
    app.run()
