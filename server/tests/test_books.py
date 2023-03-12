from http import HTTPStatus
import app


def test_get_books(client, monkeypatch):
    """test if our route  to get books resolves and has our expected schema"""
    books = [{
        "title": "some title",
        "author": "Robert McBurger",
        "read": False
    }]

    monkeypatch.setattr(app, "BOOKS", books)

    response = client.get("/books")
    assert response.status_code == HTTPStatus.OK
    assert response.json == {
        "status": "success",
        "books": books,
    }


def test_post_books(client, monkeypatch):
    """test if our route to POST books resolves and adds a book"""
    books = [{
        "title": "some title",
        "author": "Robert McBurger",
        "read": False
    }]
    new_book = {
        "title": "other title",
        "author": "Burger McRobert",
        "read": True
    }
    assert len(books) == 1
    monkeypatch.setattr(app, "BOOKS", books)

    response = client.post("/books", json=new_book)

    assert response.status_code == HTTPStatus.OK
    assert response.json == {
        "status": "success",
        "message": "Book added!",
    }
    assert len(books) == 2
    assert books[1] == new_book


def test_post_books_fails_missing_key(client, monkeypatch):
    """trigger an error response by omitting a key"""
    books = [{
        "title": "some title",
        "author": "Robert McBurger",
        "read": False
    }]
    new_book = {
        "title": "other title",
        "author": "Burger McRobert",
    }
    assert len(books) == 1
    monkeypatch.setattr(app, "BOOKS", books)

    response = client.post("/books", json=new_book)

    assert response.status_code == HTTPStatus.BAD_REQUEST
    assert response.json == {
        "status": "error",
        "message": "validation failed",
    }
    assert len(books) == 1


def test_post_books_fails_too_many_keys(client, monkeypatch):
    """trigger an error response by post more keys than defined"""
    books = [{
        "title": "some title",
        "author": "Robert McBurger",
        "read": False
    }]
    new_book = {
        "title": "other title",
        "author": "Burger McRobert",
        "read": False,
        "not_present": "should raise error"
    }
    assert len(books) == 1
    monkeypatch.setattr(app, "BOOKS", books)

    response = client.post("/books", json=new_book)

    assert response.status_code == HTTPStatus.BAD_REQUEST
    assert response.json == {
        "status": "error",
        "message": "validation failed",
    }
    assert len(books) == 1


def test_post_books_fails_wrong_type(client, monkeypatch):
    """trigger an error response by sending a wrong type"""
    books = [{
        "title": "some title",
        "author": "Robert McBurger",
        "read": False
    }]
    new_book = {
        "title": "other title",
        "author": "Burger McRobert",
        "read": "True"
    }
    assert len(books) == 1
    monkeypatch.setattr(app, "BOOKS", books)

    response = client.post("/books", json=new_book)

    assert response.status_code == HTTPStatus.BAD_REQUEST
    assert response.json == {
        "status": "error",
        "message": "validation failed",
    }
    assert len(books) == 1


def test_post_books_fails_duplicate_book(client, monkeypatch):
    """trigger an error response by sending book which is alread in the list"""
    books = [{
        "title": "some title",
        "author": "Robert McBurger",
        "read": False
    }]
    assert len(books) == 1
    monkeypatch.setattr(app, "BOOKS", books)

    response = client.post("/books", json=books[0])

    assert response.status_code == HTTPStatus.BAD_REQUEST
    assert response.json == {
        "status": "error",
        "message": "book already in books",
    }
    assert len(books) == 1
