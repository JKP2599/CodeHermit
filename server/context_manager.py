"""
Scan project workspace, chunk files, embed via Ollama or external embedder,
and store/retrieve from Chroma vector store.
"""
import os
from code_assistant_rust import index_and_embed, retrieve_chunks

class ContextManager:
    def __init__(self, workspace_dir: str, persist_dir: str = ".chroma"):
        """Initialize the context manager with workspace and persistence settings."""
        self.dir = workspace_dir
        self.persist_dir = persist_dir

    def index_files(self):
        """Scan workspace and index all files in the vector store."""
        index_and_embed(self.dir, self.persist_dir)

    def retrieve(self, query: str, k: int = 5) -> list[str]:
        """Query the vector store and return relevant chunks."""
        return retrieve_chunks(query, k) 