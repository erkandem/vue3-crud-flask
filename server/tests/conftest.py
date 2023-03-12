from app import app as runtime_app
import pytest


@pytest.fixture()
def get_app():
    runtime_app.config.update({
        "TESTING": True,
    })
    yield runtime_app


@pytest.fixture()
def client(get_app):
    return get_app.test_client()

