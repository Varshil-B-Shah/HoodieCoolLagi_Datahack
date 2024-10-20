import logging
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from collections import deque
import os
from groq import Groq

# Configure logging
logging.basicConfig(level=logging.INFO)

# Create a Flask application instance
app = Flask(__name__)

# Configure CORS for the /test route
CORS(app, resources={r"/test": {"origins": "*"}})

client = Groq(
    api_key="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",
)

with open('prompt.txt', 'r') as file:
    prompts = file.readlines()

def checkcatogory(prompt):
    completion = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[
            {   
                "role": "user",
                "content": f'Analyze the following line: "{prompt}". Determine if it belongs to one of these categories: Network Security, Data Protection, Incident Response, or Compliance. Respond in only 1 word from "Network_Security", "Data_Protection", "Incident_Response", "Compliance", or "None". Make sure nothing else is said.'
            }
        ],
        temperature=1,
        top_p=1,
        stream=True,
        stop=None,
    )

    ans = list()
    for chunk in completion:
        ans.append(chunk.choices[0].delta.content or "")
    ans = "".join(ans)
    return ans

def summarise(prompt):
    completion = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[
            {   
                "role": "user",
                "content": f"""Given the following list of points, identify points that describe the same concept or idea. Then, group these points together based on their connection, provide a concise summary of how they are related, and expand on their common meaning in a simple and straightforward format:
                            {prompt}
                            Please ensure the response is limited to a summarized explanation of the connections between the grouped points and their shared meaning."""
            }
        ],
        temperature=1,
        top_p=1,
        stream=True,
        stop=None,
    )

    ans = list()
    for chunk in completion:
        ans.append(chunk.choices[0].delta.content or "")
    ans = "".join(ans)
    return ans

def generateinitialquestions(prompt):
    completion = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[
            {   
                "role": "user",
                "content": f"""
                                Given the following summary of points, identify the gaps in the information provided. Based on these gaps, generate specific questions to gather missing information or clarify any ambiguity. The output should be a list of questions, separated by commas, designed to complete or clarify the summary. Output only the questions in plain text format.
                                Summary: {prompt}
                                Return the questions, separated by commas.
                            """
            }
        ],
        temperature=1,
        top_p=1,
        stream=True,
        stop=None,
    )

    ans = list()
    for chunk in completion:
        ans.append(chunk.choices[0].delta.content or "")
    ans = "".join(ans)
    ans = ans.split(',')
    ans = [item.strip() for item in ans]
    return ans

@app.route('/checkcategory', methods=['POST'])
def check_category_route():
    prompt = request.json.get('prompt')
    result = checkcatogory(prompt)
    return jsonify({"category": result})

@app.route('/summarise', methods=['POST'])
def summarise_route():
    prompt = request.json.get('prompt')
    result = summarise(prompt)
    return jsonify({"summary": result})

@app.route('/generateinitialquestions', methods=['POST'])
def generate_initial_questions_route():
    prompt = request.json.get('prompt')
    result = generateinitialquestions(prompt)
    return jsonify({"questions": result})

@app.route('/test')
def test():
    return jsonify({"message": "This is a test JSON response"})

# Define a simple route to test the server
@app.route('/')
def home():
    return "Hello, World!"

# Run the Flask application on port 4000
if __name__ == '__main__':
    app.run(debug=True, port=4000)