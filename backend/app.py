from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/greet', methods=['GET'])
def greet():
    name = request.args.get('name', 'World')
    return jsonify(message=f"Hello, {name}!")

@app.route('/api/data', methods=['POST'])
def receive_data():
    data = request.json
    return jsonify(success=True, received=data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
