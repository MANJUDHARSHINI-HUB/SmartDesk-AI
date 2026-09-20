import os
import glob

import chromadb
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from groq import Groq


load_dotenv()


# -----------------------------
# AI Models
# -----------------------------

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


# -----------------------------
# ChromaDB
# -----------------------------

chroma_client = chromadb.PersistentClient(
    path="./chroma_db"
)

collection = chroma_client.get_or_create_collection(
    name="smartdesk_knowledge"
)


# -----------------------------
# Load Knowledge Base
# -----------------------------

documents = []
ids = []

for file_path in glob.glob("../knowledge_base/*.txt"):

    with open(file_path, "r", encoding="utf-8") as file:
        text = file.read()

    documents.append(text)
    ids.append(os.path.basename(file_path))


# -----------------------------
# Store Documents in ChromaDB
# -----------------------------

if documents:

    embeddings = embedding_model.encode(
        documents
    ).tolist()

    collection.upsert(
        documents=documents,
        embeddings=embeddings,
        ids=ids
    )


# -----------------------------
# RAG + Groq Function
# -----------------------------

def ask_ai(question):

    # Convert user question into embedding
    question_embedding = embedding_model.encode(
        [question]
    ).tolist()


    # Retrieve relevant documents
    results = collection.query(
        query_embeddings=question_embedding,
        n_results=3
    )


    # Combine retrieved knowledge
    context = "\n\n".join(
        results["documents"][0]
    )


    # RAG Prompt
    prompt = f"""
You are SmartDesk AI, an IT support assistant.

Answer the user's question using the provided IT support knowledge.

Knowledge:
{context}

User question:
{question}

Instructions:
- Give a clear and helpful answer.
- Use the provided knowledge when possible.
- Do not invent technical procedures.
- If the knowledge does not contain the answer,
  say that the issue should be escalated to IT support.
"""


    # Send prompt to Groq LLM
    response = client.chat.completions.create(

        model="openai/gpt-oss-120b",

        messages=[
            {
                "role": "system",
                "content": "You are a helpful IT support assistant."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],

        temperature=0.2
    )


    # Return AI answer
    return response.choices[0].message.content