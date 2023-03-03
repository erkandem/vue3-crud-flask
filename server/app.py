from flask import Flask, jsonify
from flask_cors import CORS


# configuration
#TODO remove debug from code base
DEBUG = True

# instantiate the app
app = Flask(__name__)
app.config.from_object(__name__)

# enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})


# sanity check route
@app.route('/ping', methods=['GET'])
def ping_pong():
    return jsonify(message="pong!")


if __name__ == '__main__':
    app.run()
