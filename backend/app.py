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

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify(success=False, message="No file part in the request"), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify(success=False, message="No file selected"), 400

    if file and file.filename.endswith('.txt'):
        content = file.read().decode('utf-8')  # Read and decode the file content
        return jsonify(success=True, content=content)

    return jsonify(success=False, message="Invalid file type. Please upload a .txt file"), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
