import pytest
from web_orchestrator import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health(client):
    response = client.get('/health')
    assert response.status_code == 200
    assert b'OK' in response.data

def test_apply_rules(client):
    response = client.post('/apply_rules')
    assert response.status_code == 200