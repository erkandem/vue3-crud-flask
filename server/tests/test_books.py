"""
Regarding the tests for validation:
We could test them in a matrix with pytest.parametrize with every possiblecombo,
but most API frameworks include incoming and outgoing schema validation feature and
that's not the focus of the tutorial
"""

from http import HTTPStatus
from uuid import uuid4
import pytest

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


def test_put_route_is_successful(client, monkeypatch):
    books = [{
        "id": str(uuid4()),
        "title": "some title",
        "author": "Robert McBurger",
        "read": False
    }]
    modified_book = {
        "title": "some other title",
        "author": "Robert McBurger",
        "read": False
    }
    assert len(books) == 1
    monkeypatch.setattr(app, "BOOKS", books)

    response = client.put(f"/books/{books[0]['id']}", json=modified_book)

    assert response.status_code == HTTPStatus.OK
    assert response.json == {
        "status": "success",
        "message": "Updated book.",
    }
    assert len(books) == 1
    expectation = {"id": books[0]["id"]}
    expectation.update(modified_book)
    assert books[0] == expectation


def test_put_route_is_successful_with_id_part_of_the_payload(
        client,
        monkeypatch,
):
    books = [{
        "id": str(uuid4()),
        "title": "some title",
        "author": "Robert McBurger",
        "read": False
    }]
    modified_book = {
        "id": books[0]["id"],
        "title": "some other title",
        "author": "Robert McBurger",
        "read": False
    }
    assert len(books) == 1
    monkeypatch.setattr(app, "BOOKS", books)

    response = client.put(f"/books/{books[0]['id']}", json=modified_book)

    assert response.status_code == HTTPStatus.OK
    assert response.json == {
        "status": "success",
        "message": "Updated book.",
    }
    assert len(books) == 1
    assert books[0] == modified_book


def test_put_route_fails_because_res_does_not_exist(
        client,
        monkeypatch,
):
    books = [{
        "id": str(uuid4()),
        "title": "some title",
        "author": "Robert McBurger",
        "read": False
    }]
    modified_book = {
        "title": "some other title",
        "author": "Robert McBurger",
        "read": False
    }
    id_to_modify = str(uuid4())
    assert len(books) == 1
    assert books[0]["id"] != id_to_modify
    monkeypatch.setattr(app, "BOOKS", books)

    response = client.put(f"/books/{id_to_modify}", json=modified_book)

    assert response.status_code == HTTPStatus.BAD_REQUEST
    assert response.json == {
        "status": "error",
        "message": "Book not in DB.",
    }
    assert len(books) == 1
    assert books[0] != modified_book


def test_put_route_fails_because_body_is_partial(
        client,
        monkeypatch,
):
    books = [{
        "id": str(uuid4),
        "title": "some title",
        "author": "Robert McBurger",
        "read": False
    }]
    modified_book = {
        "title": "some other title",
        # Author key is missing
        "read": False
    }
    assert len(books) == 1
    monkeypatch.setattr(app, "BOOKS", books)

    response = client.put(f"/books/{books[0]['id']}", json=modified_book)

    assert response.status_code == HTTPStatus.BAD_REQUEST
    assert response.json == {
        "status": "error",
        "message": "Validation failed.",
    }
    assert len(books) == 1
    assert books[0] != modified_book
