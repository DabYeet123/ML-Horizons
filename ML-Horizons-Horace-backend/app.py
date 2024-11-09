from flask import Flask, jsonify, request
from flask_cors import CORS
from appAPI.chatbot_with_retriever import chatbot_knowledge_retriever
from appAPI.coding_assistant import coding_assistant
from appAPI.project_requirement import project_generator
from appAPI.title_generation import title_generator

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/chatbot', methods=['POST'])
def get_response_from_ai(): #General Chat Bot
    data = request.get_json()
    print(data)
    user_input = data.get('input')
    session_id = data.get("session_id")

    if not user_input:
        return jsonify({'error': 'No input provided'}), 400
    result = chatbot_knowledge_retriever(session_id=session_id, query=user_input)

    return jsonify({'result': result}), 200

@app.route('/codingchatbot', methods=['POST'])
def get_coding_assistant(): # Coding Assistant
    data = request.get_json()
    user_input = data.get("input")
    session_id = data.get("session_id")
    project_requirement = data.get("pr")
    if not user_input:
        return jsonify({'error': 'No input provided'}), 400
    result = coding_assistant(session_id=session_id, query=user_input, project=project_requirement)

    return jsonify({'result': result})

@app.route("/gtitle", methods=["POST"])
def generate_title(): # Title Generation for Chat Conversation
    data=request.get_json()
    session_id= data.get("session_id")
    user_input= data.get("input")
    if not user_input:
        return jsonify({'error': 'No input provided'}), 400
    result = title_generator(session_id=session_id, query=user_input)
    return jsonify({'result': result})

@app.route("/gproject", methods=["POST"])
def generate_project_requirement(): # Project Requirement and Description
    data=request.get_json()
    session_id= data.get("session_id")
    level = data.get("level")
    target_alg = data.get("alg")
    application = data.get("application")

    result = project_generator(session_id=session_id, ML_Past_Experience=level, Application_of_the_project=application, Algorithm_Wanted_to_try=target_alg )

    return jsonify({"result": result})



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
