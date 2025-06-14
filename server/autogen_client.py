"""
Helper to call AutoGen for multi-agent dialogue.
"""
from autogen import ConversableAgent, GroupChatManager
import os
import json
from typing import Union, Dict, Any

def run_autogen_chat(system_messages: list[str], user_message: str) -> Union[str, Dict[str, Any]]:
    """
    Run a multi-agent chat session using AutoGen.
    
    Args:
        system_messages: List of system messages for each agent
        user_message: The user's message to process
        
    Returns:
        Union[str, Dict[str, Any]]: The response from the agents, either as a string or a structured dict
    """
    try:
        # Configure LLM settings (only allowed fields)
        llm_config = {
            "config_list": [{
                "model": os.getenv("OLLAMA_MODEL", "codellama:7b-instruct")
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
            messages=[],
            max_round=5
        )
        
        # Run the chat and collect results
        chat_result = manager.run_stream(user_message)
        
        # Format the response
        if isinstance(chat_result, dict):
            if "summary" in chat_result:
                return {
                    "response": chat_result["summary"],
                    "status": "success"
                }
            return {
                "response": json.dumps(chat_result, indent=2),
                "status": "success"
            }
        elif isinstance(chat_result, str):
            return {
                "response": chat_result,
                "status": "success"
            }
        else:
            return {
                "response": str(chat_result),
                "status": "success"
            }
            
    except Exception as e:
        return {
            "response": f"Error in AutoGen chat: {str(e)}",
            "status": "error"
        } 