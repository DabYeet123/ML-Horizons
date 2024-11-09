from langchain_mongodb import MongoDBChatMessageHistory
import os 


def get_history(session_id):
    MONGODB_CONNECTION_STRING_URL= os.getenv("MONGODB_CONNECTION_STRING_URL")

    history = MongoDBChatMessageHistory(
            session_id=session_id,
            connection_string=MONGODB_CONNECTION_STRING_URL,
            database_name="MLHorizon",
            collection_name="MessageStore",
        )
    
    return history
