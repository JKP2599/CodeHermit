"""
Sandboxed code execution using Rust implementation.
"""
from typing import Dict, Any
from code_assistant_rust import execute_code

class CodeExecutor:
    def __init__(self, timeout_ms: int = 5000):
        """Initialize the code executor with timeout settings."""
        self.timeout_ms = timeout_ms

    def run(self, code: str) -> Dict[str, Any]:
        """
        Execute code in a sandboxed environment.
        
        Args:
            code: The code to execute
            
        Returns:
            Dict containing:
                - stdout: Standard output
                - stderr: Standard error
                - exit_code: Process exit code
        """
        return execute_code(code, self.timeout_ms)

    def run_with_timeout(self, code: str, timeout_ms: int) -> Dict[str, Any]:
        """
        Execute code with a custom timeout.
        
        Args:
            code: The code to execute
            timeout_ms: Custom timeout in milliseconds
            
        Returns:
            Dict containing execution results
        """
        return execute_code(code, timeout_ms) 