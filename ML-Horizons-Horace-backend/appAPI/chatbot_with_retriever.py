from base.sonnet_llm import llm_sonnet
from base.base_embedding import get_embedding_model
from mongodb_text_retriever import MongoDBKeywordRetriever

from langchain_mongodb import MongoDBAtlasVectorSearch
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from langchain_core.prompts import ChatPromptTemplate
from langchain.retrievers.contextual_compression import ContextualCompressionRetriever
from langchain_cohere import CohereRerank
from langchain_community.llms import Cohere
from langchain.retrievers import EnsembleRetriever
from langchain_core.runnables import RunnablePassthrough, RunnableMap
from langchain_core.output_parsers import StrOutputParser
from langchain_mongodb import MongoDBChatMessageHistory
from langchain_core.messages import HumanMessage
import os


def chatbot_knowledge_retriever(session_id, query):
    MONGODB_CONNECTION_STRING_URL= os.getenv("MONGODB_CONNECTION_STRING_URL")

    client = MongoClient(MONGODB_CONNECTION_STRING_URL, server_api=ServerApi('1'))

    embeddings = get_embedding_model()

    vector_store = MongoDBAtlasVectorSearch(
        collection=client["MLHorizon"].MLKnowledgeBase,
        embedding=embeddings,
        index_name="vector_index",
        relevance_score_fn="cosine",
    )
    semantic_retriever = vector_store.as_retriever(include_metadata=True, metadata_key ='Category',search_kwargs={"k": 85})
    keyword_retriever = MongoDBKeywordRetriever(collection=client["MLHorizon"].MLKnowledgeBase, top_k=5)

    compressor = CohereRerank(model="rerank-english-v3.0",top_n=5)
    compression_retriever= ContextualCompressionRetriever(
        base_compressor=compressor, base_retriever=semantic_retriever
    )

    retriever = EnsembleRetriever(     
            retrievers=[compression_retriever, keyword_retriever], weights=[0.7, 0.3]
    )

    def format_docs(all_documents):
        return "\n\n".join(str(doc) for doc in all_documents)

    system_prompt = """
    Role: Expert ML & AI Chatbot

    Task: You are incredible in the fields of AI and Machine Leraning whic allows you to answer any relevant questions, including machine learning applications, different algorithms, technical coding problems, and all the theories. 
    As a result, you are not suppose to provide any assistance to user when the user is not asking questions that are relevant AI/ML. 
    To assist you in providing the best response to user, the following are some aid information:

    {context}

    Using the provided informmation incorperating with your own knowledge, please provide a clear and precise response to user.
    Note: If no information is provided, you can solely apply your intellegence to generate a response.

    Output Guideline: Enssure your response is short, precise, and informative. 
    """

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            ("placeholder", "{messages}"),
            ("human", "{question}")
        ]
    )

    chain = RunnableMap({
    "context": RunnablePassthrough().pick("question") | retriever | format_docs,
    "question": RunnablePassthrough().pick("question"),
    "messages": RunnablePassthrough().pick("messages"),
    }) | prompt | llm_sonnet() | StrOutputParser()

    history = MongoDBChatMessageHistory(
        session_id=session_id,
        connection_string=MONGODB_CONNECTION_STRING_URL,
        database_name="MLHorizon",
        collection_name="MessageStore",
    )

    # Retrieve messages
    messages = history.messages

    config = {"configurable": {"session_id": session_id}}

    ai_message = chain.invoke({"question": query, "messages":messages}, config=config)
    human_message = HumanMessage(content=query, name="User")
    history.add_user_message(human_message)
    history.add_ai_message(ai_message)

    return ai_message
 