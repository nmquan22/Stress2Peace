from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain.chains import RetrievalQA
from langchain_cohere import CohereEmbeddings
from langchain_cohere import ChatCohere
from langchain_mongodb import MongoDBAtlasVectorSearch
from pymongo import MongoClient
import os
import traceback
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)
load_dotenv()

# === Environment Variables ===
cohere_api_key = os.getenv("VITE_COHERE_API_KEY")
mongo_uri = os.getenv("VITE_MONGO_URI")  # example: mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority
mongo_db = os.getenv("MONGO_DB_NAME", "Stress2Peace")
mongo_collection = os.getenv("MONGO_COLLECTION_NAME", "documents")

# === Setup ===
client = MongoClient(mongo_uri)
collection = client[mongo_db][mongo_collection]

embeddings = CohereEmbeddings(
    cohere_api_key=cohere_api_key,
    model="embed-english-v3.0"
)

llm = ChatCohere(
    cohere_api_key=cohere_api_key,
    model="command-r",
    temperature=0.7,
    max_tokens=300
)

# Function to filter documents based on user_id
def filter_documents_by_user_id(retriever, user_id):
    # Retrieve the documents
    documents = retriever.retrieve()

    # Filter documents based on user_id (assuming the metadata contains 'userId')
    filtered_documents = [
        doc for doc in documents if doc.get('metadata', {}).get('userId') == user_id
    ]
    
    return filtered_documents

@app.route("/rag_chat", methods=["POST"])
def rag_chat():
    data = request.get_json()
    query = data.get("message", "")
    user_id = data.get("userId", None)
    print("User ID:", user_id)

    if not query:
        return jsonify({"response": "No message provided"}), 400

    try:
        # Filter documents by userId metadata
        vector_store = MongoDBAtlasVectorSearch(
            collection=collection,
            embedding=embeddings,
        )
        
        retriever = vector_store.as_retriever(
            search_kwargs={'pre_filter': {'metadata.userId': {'$eq': user_id}}}
        )
        
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            retriever=retriever,
            verbose=True  # Enable detailed logging
        )
        result = qa_chain.invoke({"query": query})  # Sử dụng invoke thay vì run
        return jsonify({"response": result["result"]})
        
    except Exception as e:
        print("Full error traceback:", traceback.format_exc())
        return jsonify({"response": f"Filter error: {str(e)}"}), 500

if __name__ == "__main__":
     app.run(host="0.0.0.0", port=5001, debug=True)
