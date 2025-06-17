"""
Tests for Rust-backed implementations.
"""
import os
import pytest
from context_manager import ContextManager
from code_exec import CodeExecutor
from utils import get_changed_files, process_large_data, analyze_code_complexity

@pytest.fixture
def test_workspace(tmp_path):
    """Create a temporary workspace with test files."""
    workspace = tmp_path / "test_workspace"
    workspace.mkdir()
    
    # Create some test files
    (workspace / "test1.py").write_text("def hello():\n    print('Hello')\n")
    (workspace / "test2.py").write_text("def world():\n    print('World')\n")
    
    return workspace

def test_context_manager(test_workspace):
    """Test context manager indexing and retrieval."""
    cm = ContextManager(str(test_workspace))
    cm.index_files()
    
    # Test retrieval
    results = cm.retrieve("print hello", k=2)
    assert len(results) > 0
    assert any("Hello" in r for r in results)

def test_code_executor():
    """Test code execution."""
    executor = CodeExecutor()
    result = executor.run("print('test')")
    
    assert isinstance(result, dict)
    assert "stdout" in result
    assert "stderr" in result
    assert "exit_code" in result

def test_diff_parsing():
    """Test git diff parsing."""
    diff = """diff --git a/test.py b/test.py
index abc123..def456 100644
--- a/test.py
+++ b/test.py
@@ -1,3 +1,4 @@
 def hello():
     print('Hello')
+    print('World')
"""
    changed_files = get_changed_files(diff)
    assert len(changed_files) == 1
    assert changed_files[0] == "test.py"

def test_data_processing():
    """Test large data processing."""
    test_data = "Hello, World!" * 1000
    result = process_large_data(test_data)
    assert isinstance(result, bytes)
    assert len(result) > 0

def test_code_complexity():
    """Test code complexity analysis."""
    code = """
def complex_function():
    for i in range(10):
        for j in range(10):
            if i > j:
                print(i * j)
"""
    metrics = analyze_code_complexity(code)
    assert isinstance(metrics, dict)
    assert "complexity_score" in metrics
    assert "raw_metrics" in metrics 