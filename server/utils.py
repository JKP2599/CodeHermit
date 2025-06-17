"""
Utility functions for code analysis and processing.
"""
from typing import List, Dict, Any, Union
from code_assistant_rust import parse_diff, compute_heavy

def get_changed_files(diff_text: str) -> List[str]:
    """
    Parse git diff text to get list of changed files.
    
    Args:
        diff_text: Raw git diff output
        
    Returns:
        List of changed file paths
    """
    return parse_diff(diff_text)

def process_large_data(data: Union[str, bytes]) -> bytes:
    """
    Process large data using Rust implementation.
    
    Args:
        data: Input data as string or bytes
        
    Returns:
        Processed data as bytes
    """
    if isinstance(data, str):
        data = data.encode('utf-8')
    return compute_heavy(data)

def analyze_code_complexity(code: str) -> Dict[str, Any]:
    """
    Analyze code complexity using Rust implementation.
    
    Args:
        code: Source code to analyze
        
    Returns:
        Dict containing complexity metrics
    """
    # Convert code to bytes for processing
    code_bytes = code.encode('utf-8')
    result = compute_heavy(code_bytes)
    
    # Parse the result into metrics
    # This is a placeholder - actual implementation would depend on
    # what metrics you want to compute
    return {
        "complexity_score": len(result),  # Placeholder
        "raw_metrics": result.hex()
    } 