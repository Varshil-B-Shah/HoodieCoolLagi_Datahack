import logging
from flask import Flask
from flask_cors import CORS

# Configure logging
logging.basicConfig(level=logging.INFO)

# Create a Flask application instance
app = Flask(__name__)

# Configure CORS for the Flask application
CORS(app)

@app.route('/test')
def test():
    return {"message": "This is a test JSON response"}

# Define a simple route to test the server
@app.route('/')
def home():
    return "Hello, World!"

# Run the Flask application on port 4000
if __name__ == '__main__':
    app.run(debug=True, port=4000)