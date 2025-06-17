"""
Helper to call AutoGen for multi-agent dialogue using local Ollama models.
"""
from autogen import ConversableAgent, GroupChatManager
import os
from dotenv import load_dotenv
from typing import Union, Dict, Any

# Load environment variables
load_dotenv()

def run_autogen_chat(system_messages: list[str], user_message: str) -> Union[str, Dict[str, Any]]:
    """
    Run a multi-agent chat session using AutoGen with local Ollama models.
    
    Args:
        system_messages: List of system messages for each agent
        user_message: The user's message to process
        
    Returns:
        Union[str, Dict[str, Any]]: The response from the agents, either as a string or a structured dict
    """
    try:
        # Configure LLM settings for local Ollama model
        llm_config = {
            "config_list": [{
                "model": os.getenv("OLLAMA_MODEL", "codellama:7b-instruct"),
                "base_url": "http://localhost:11434",
                "api_type": "open_ai",
                "api_key": "not-needed",  # Ollama doesn't require an API key
                "options": {
                    "num_gpu": 1,  # Use 1 GPU
                    "num_thread": 4,  # Adjust based on your CPU
                    "gpu_layers": 35,  # Use 35 layers on GPU (optimal for 7B models)
                    "num_ctx": 4096,  # Context window size
                    "num_batch": 512,  # Batch size for inference
                    "num_gqa": 8,  # Number of grouped-query attention heads
                    "rope_scaling": None,  # No RoPE scaling
                    "temperature": 0.7,
                    "top_p": 0.95,
                    "top_k": 40,
                    "repeat_penalty": 1.1,
                    "mirostat": 0,
                    "mirostat_eta": 0.1,
                    "mirostat_tau": 5.0,
                    "seed": 42
                }
            }],
            "temperature": 0.7,
            "timeout": 60
        }
        
        # Create agents with different roles
        agents = [
            ConversableAgent(
                name=f"Agent{i}",
                system_message=msg,
                llm_config=llm_config
            )
            for i, msg in enumerate(system_messages)
        ]
        
        # Create and run group chat
        manager = GroupChatManager(
            groupchat=agents,
            llm_config=llm_config,
            messages=[{"role": "user", "content": user_message}]
        )
        
        # Process the chat
        chat_result = manager.run()
        
        # Return the final response
        if isinstance(chat_result, dict):
            return chat_result
        return {"response": str(chat_result)}
        
    except Exception as e:
        return {"error": str(e)} 