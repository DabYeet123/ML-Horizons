from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.server_api import ServerApi
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define database and collection
db = None
collection = None
client = None
# Define database and collection names
db_name = "MLHorizon"
collection_name = "MLUserDataStorage"

def connect():
    MONGODB_USER_NAME = "zeyucai"
    MONGODB_USER_PASSWORD = "1234567890"
    uri = f"mongodb+srv://{MONGODB_USER_NAME}:{MONGODB_USER_PASSWORD}@mldatabase.36zie.mongodb.net/?retryWrites=true&w=majority&appName=MLDatabase"
    #"mongodb+srv://zeyucai:1234567890@mldatabase.36zie.mongodb.net/?retryWrites=true&w=majority&appName=MLDatabase"
    client = MongoClient(uri, server_api=ServerApi('1'))
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(e)
    global db 
    db = client[db_name]
    global collection 
    collection = db[collection_name]

connect()

# Endpoint to get all users
@app.route('/users', methods=['GET'])
def get_users():
    try:
        users = list(collection.find({}))
        data = {}
        # Convert MongoDB documents to JSON format
        for user in users:
            user['_id'] = str(user['_id'])  # Convert ObjectId to string
            data[user["googleID"]] = user
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint to add a new user
@app.route('/users', methods=['POST'])
def add_user():
    new_user = request.get_json()
    unique_id = new_user.get("USERID")

    try:
        existing_user = collection.find_one({"USERID": unique_id})
        if not existing_user:
            new_user['chatBotConversations'] = []
            new_user['canvasConversations'] = []
            collection.insert_one(new_user)  # Add new user
            return jsonify({'message': 'User added successfully!'}), 201
        else:
            # Update the existing user
            collection.update_one(
                {"USERID": unique_id},
                {"$set": {"chatBotConversations": new_user['chatBotConversations']}}
            )
            return jsonify({'message': 'User updated successfully!'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/users', methods=['PUT'])
def replace_user():
    replace_data = request.get_json()
    replace_data["_id"] = ""
    unique_id = replace_data.get("USERID")
    try:
        user_data = collection.find_one({"USERID": unique_id})
        for info in user_data:
            if info not in replace_data:
                replace_data[info] = user_data[info]
        # Update the existing user
        collection.update_one(
            {"USERID": unique_id},
            {"$set": {
                "googleID": replace_data["googleID"],
                "firstName": replace_data["firstName"],
                "lastName" : replace_data["lastName"],
                "emial": replace_data["email"],
                "chatBotConversations": replace_data['chatBotConversations'],
                "canvasConversations" : replace_data["canvasConversations"]
                }})
        return jsonify({'message': 'User updated successfully!'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Start the Flask server
if __name__ == '__main__':
    try:
        app.run(host='0.0.0.0', port=5000, debug=True)
    except KeyboardInterrupt:
        client.close()
        print("\nServer is shutting down.")
        

