from http import HTTPStatus  # https://docs.python.org/3/library/http.html
import app


def test_get_books(client, monkeypatch):
    """test if our route  to get books resolves and has our expected schema"""
    books = [{
        "title": "some title",
        "author": "Robert McBurger",
        "read": False
    }]

    def get_books():
        return books

    monkeypatch.setattr(app, "get_books", get_books)

    response = client.get("/books")
    assert response.status_code == HTTPStatus.OK
    assert response.json == {
        "status": "success",
        "books": books,
    }
