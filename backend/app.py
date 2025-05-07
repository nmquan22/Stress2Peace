from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain.chains import RetrievalQA
from langchain_mongodb import MongoDBAtlasVectorSearch
from langchain_huggingface import HuggingFaceEmbeddings
# from langchain_community.llms import HuggingFacePipeline
# from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
from langchain_cohere import ChatCohere
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import traceback

# Setup
app = Flask(__name__)
CORS(app)
load_dotenv()

# Environment Variables
cohere_api_key = os.getenv("VITE_COHERE_API_KEY")
mongo_uri = os.getenv("VITE_MONGO_URI")
mongo_db = os.getenv("MONGO_DB_NAME", "Stress2Peace")
mongo_collection = os.getenv("MONGO_COLLECTION_NAME", "document")
chat_history_collection_name = os.getenv("CHAT_HISTORY_COLLECTION_NAME", "chatHistory")

# MongoDB Client
client = MongoClient(mongo_uri)
db = client[mongo_db]
collection = db[mongo_collection]
chat_history_collection = db[chat_history_collection_name]

# # Embeddings + LLM
# embeddings = CohereEmbeddings(
#     cohere_api_key=cohere_api_key,
#     model="embed-english-v3.0"
# )

llm = ChatCohere(
    cohere_api_key=cohere_api_key,
    model="command-r",
    temperature=0.7,
    max_tokens=300
)

# === Embeddings ===
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


# Setup Vector Store
vector_store = MongoDBAtlasVectorSearch(
    collection=collection,
    embedding=embeddings,
    #index_name = "vector_index", for cohere embedding
    index_name = "vector_hf",

)

# # ====== Helper functions ======
# def save_to_mongo(text, embedding, user_id, topic="general"):
#     document = {
#         "text": text,
#         "embedding": embedding,
#         "metadata": {
#             "userId": user_id,
#             "createdAt": datetime.now().isoformat(),
#             "topic": topic
#         }
#     }
#     collection.insert_one(document)

# def save_history(user_id, user_message, bot_message):
#     history_collection.insert_one({
#         "userId": user_id,
#         "user_message": user_message,
#         "bot_message": bot_message,
#         "createdAt": datetime.now().isoformat()
#     })

# def retrieve_similar(user_id, query, k=3):
#     results = vector_store.similarity_search(
#         query=query,
#         k=k,
#         pre_filter={"metadata.userId": {"$eq": user_id}}  # Only retrieve user-specific data
#     )
#     return results

@app.route("/rag_chat", methods=["POST"])
def rag_chat():
    try:
        data = request.get_json()
        query = data.get("message", "")
        user_id = data.get("userId", None)

        if not query or not user_id:
            return jsonify({"error": "Missing message or userId"}), 400

        # Create retriever with pre-filtering
        retriever = vector_store.as_retriever(
            # search_kwargs={
            #     'filter': {
            #     'metadata.userId': {'$eq': user_id},
            #     }
            # } #old version 
            filter= {
                'metadata.userId': {'$eq': user_id}
                }
        )

        # RetrievalQA chain
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            retriever=retriever,
            verbose=True
        )

        # Get result
        result = qa_chain.invoke({"query": query})

        # Save chat history
        chat_history_collection.insert_one({
            "userId": user_id,
            "query": query,
            "response": result["result"],
        })
        # 4. Save the new question+answer into the vector database
        # Save as a new document
        doc = {
            "text": f"User: {query}\nBot: {result["result"]}",
            "embedding": embeddings.embed_query(query),
            "metadata": {
                "userId": user_id,
            }
        }
        collection.insert_one(doc)
        return jsonify({"response": result["result"]})

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
