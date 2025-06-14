"""
Scan project workspace, chunk files, embed via Ollama or external embedder,
and store/retrieve from Chroma vector store.
"""
import os
from chromadb import Client, Settings
from chromadb.utils import embedding_functions
import hashlib

class ContextManager:
    def __init__(self, workspace_dir: str, persist_dir: str = ".chroma"):
        """Initialize the context manager with workspace and persistence settings."""
        self.client = Client(Settings(
            persist_directory=persist_dir,
            anonymized_telemetry=False
        ))
        self.dir = workspace_dir
        self.collection = self.client.get_or_create_collection(
            name="workspace_context",
            embedding_function=embedding_functions.OllamaEmbeddingFunction(
                model_name=os.getenv("EMBEDDING_MODEL", "codellama:7b-instruct"),
                url="http://localhost:11434"
            )
        )

    def _chunk_text(self, text: str, chunk_size: int = 1000) -> list[str]:
        """Split text into chunks of approximately chunk_size characters."""
        chunks = []
        current_chunk = []
        current_size = 0
        
        for line in text.splitlines():
            line_size = len(line)
            if current_size + line_size > chunk_size and current_chunk:
                chunks.append("\n".join(current_chunk))
                current_chunk = []
                current_size = 0
            current_chunk.append(line)
            current_size += line_size
        
        if current_chunk:
            chunks.append("\n".join(current_chunk))
        
        return chunks

    def _get_file_hash(self, filepath: str) -> str:
        """Generate a hash of the file contents for change detection."""
        with open(filepath, 'rb') as f:
            return hashlib.md5(f.read()).hexdigest()

    def index_files(self):
        """Scan workspace and index all files in the vector store."""
        for root, _, files in os.walk(self.dir):
            for fname in files:
                if fname.startswith('.') or fname.endswith(('.pyc', '.git')):
                    continue
                    
                filepath = os.path.join(root, fname)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Generate chunks
                    chunks = self._chunk_text(content)
                    
                    # Create metadata for each chunk
                    metadatas = [{
                        "filepath": filepath,
                        "chunk_index": i,
                        "hash": self._get_file_hash(filepath)
                    } for i in range(len(chunks))]
                    
                    # Add to collection
                    self.collection.add(
                        documents=chunks,
                        metadatas=metadatas,
                        ids=[f"{filepath}_{i}" for i in range(len(chunks))]
                    )
                except Exception as e:
                    print(f"Error indexing {filepath}: {e}")

    def retrieve(self, query: str, k: int = 5) -> list[str]:
        """Query the vector store and return relevant chunks."""
        results = self.collection.query(
            query_texts=[query],
            n_results=k
        )
        
        if not results or not results['documents']:
            return []
            
        return results['documents'][0]  # Return first query's results 