"""
Define CrewAI Flows and integrate AutoGen subroutines.
"""
from crewai.flow.flow import Flow, start, listen
from pydantic import BaseModel
from autogen_client import run_autogen_chat
import os
import requests
import json

class FlowState(BaseModel):
    prompt: str = ""
    result: str = ""
    issues: list[str] = []

class GenerateReviewFlow(Flow[FlowState]):
    @start()
    def step_generate(self, prompt: str) -> str:
        """⇨ call OllamaClient to generate code from prompt + context"""
        self.state.prompt = prompt
        model = os.getenv("OLLAMA_MODEL", "codellama:7b-instruct")
        
        try:
            # Call Ollama API with GPU configuration
            response = requests.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": model,
                    "prompt": f"Generate Python code for: {prompt}",
                    "stream": False,
                    "options": {
                        "num_gpu": 1,  # Use 1 GPU
                        "num_thread": 4,  # Adjust based on your CPU
                        "gpu_layers": -1  # Use all available GPU layers
                    }
                }
            )
            response.raise_for_status()
            result = response.json()
            generated_code = result.get("response", "")
            
            # Extract code block if present
            if "```python" in generated_code:
                code_start = generated_code.find("```python") + 9
                code_end = generated_code.find("```", code_start)
                generated_code = generated_code[code_start:code_end].strip()
            
            return generated_code
        except Exception as e:
            return f"Error generating code: {str(e)}"

    @listen(step_generate)
    def step_review(self, generated: str) -> str:
        """⇨ call AutoGen via run_autogen_chat for deep critique"""
        self.state.result = generated
        
        # Define system messages for AutoGen agents
        system_messages = [
            "You are a code reviewer focused on security and best practices.",
            "You are a performance optimization expert.",
            "You are a documentation and style guide expert."
        ]
        
        try:
            # Run AutoGen chat for review
            review = run_autogen_chat(
                system_messages=system_messages,
                user_message=f"Please review this code:\n\n{generated}"
            )
            return review
        except Exception as e:
            return f"Error during code review: {str(e)}"

    @listen(step_review)
    def step_finish(self, review) -> str:
        """⇨ combine code + fixes, return final output"""
        print(f"[DEBUG] step_finish review type: {type(review)}, value: {review}")
        if isinstance(review, dict) and 'issues' in review:
            self.state.issues = review['issues']
        elif isinstance(review, str):
            self.state.issues = review.splitlines()
        else:
            try:
                self.state.issues = str(review).splitlines()
            except Exception:
                self.state.issues = [str(review)]
        return {
            "code": self.state.result,
            "issues": self.state.issues,
            "status": "success"
        }

class ConversationFlow(Flow[FlowState]):
    @start()
    def step_chat(self, message: str) -> str:
        """Handle conversation with context awareness"""
        self.state.prompt = message
        
        try:
            # Use AutoGen for multi-agent conversation
            system_messages = [
                "You are a helpful coding assistant.",
                "You are a technical documentation expert.",
                "You are a debugging specialist."
            ]
            
            response = run_autogen_chat(
                system_messages=system_messages,
                user_message=message
            )
            return response
        except Exception as e:
            return f"Error during chat: {str(e)}" 