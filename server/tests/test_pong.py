from http import HTTPStatus  # https://docs.python.org/3/library/http.html


def test_pong(client):
    response = client.get("/ping")
    assert response.status_code == HTTPStatus.OK
    assert response.json == {"message": "pong!"}
