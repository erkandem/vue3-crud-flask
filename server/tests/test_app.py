from app import app as runtime_app
import pytest
from http import HTTPStatus  # https://docs.python.org/3/library/http.html


@pytest.fixture()
def get_app():
    runtime_app.config.update({
        "TESTING": True,
    })
    yield runtime_app


@pytest.fixture()
def client(get_app):
    return get_app.test_client()


def test_pong(client):
    response = client.get("/ping")
    assert response.status_code == HTTPStatus.OK
    assert response.json == {"message": "pong!"}
