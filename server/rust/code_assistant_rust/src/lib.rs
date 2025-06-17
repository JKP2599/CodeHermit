use pyo3::prelude::*;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::fs;
use std::time::Instant;
use log::{info, error, debug};
use serde_json::{json, Value};
use tempfile;
use walkdir::WalkDir;

// Custom error type for internal errors
#[derive(Debug)]
pub struct CodeAssistantError(String);

impl std::fmt::Display for CodeAssistantError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "{}", self.0)
    }
}

impl std::error::Error for CodeAssistantError {}

impl From<CodeAssistantError> for PyErr {
    fn from(err: CodeAssistantError) -> PyErr {
        PyErr::new::<pyo3::exceptions::PyRuntimeError, _>(err.0)
    }
}

// Helper function to convert IO errors to PyErr
fn io_to_py_err(e: std::io::Error, context: &str) -> PyErr {
    PyErr::new::<pyo3::exceptions::PyRuntimeError, _>(format!("{}: {}", context, e))
}

// Helper function to convert any error to PyErr
fn to_py_err<E: std::fmt::Display>(e: E, context: &str) -> PyErr {
    PyErr::new::<pyo3::exceptions::PyRuntimeError, _>(format!("{}: {}", context, e))
}

#[pyfunction]
fn index_and_embed(workspace: &str, persist_dir: &str) -> PyResult<()> {
    let workspace_path = Path::new(workspace);
    if !workspace_path.exists() {
        return Err(PyErr::new::<pyo3::exceptions::PyRuntimeError, _>(
            format!("Workspace path does not exist: {}", workspace)
        ));
    }

    info!("Starting file indexing for workspace: {}", workspace);
    let start_time = Instant::now();
    let mut total_files = 0;
    let mut processed_files = 0;

    // First pass: count total files
    for entry in WalkDir::new(workspace_path)
        .into_iter()
        .filter_map(|e| e.ok())
    {
        if entry.path().is_file() {
            total_files += 1;
        }
    }

    // Second pass: process files
    for entry in WalkDir::new(workspace_path)
        .into_iter()
        .filter_map(|e| e.ok())
    {
        if entry.path().is_file() {
            processed_files += 1;
            if processed_files % 10 == 0 {
                info!(
                    "Progress: {}/{} files processed",
                    processed_files, total_files
                );
            }
            
            if let Err(e) = process_file(entry.path()) {
                error!("Error processing file {:?}: {}", entry.path(), e);
            }
        }
    }

    let duration = start_time.elapsed();
    info!(
        "Completed indexing {} files in {:.2?}",
        processed_files, duration
    );
    Ok(())
}

fn process_file(path: &Path) -> Result<(), CodeAssistantError> {
    let content = fs::read_to_string(path)
        .map_err(|e| CodeAssistantError(format!("Failed to read file: {}", e)))?;
    
    // TODO: Implement actual embedding logic here
    // For now, just log that we processed the file
    debug!("Processed file: {:?}", path);
    Ok(())
}

#[pyfunction]
fn retrieve_chunks(query: &str, n_results: usize) -> PyResult<PyObject> {
    let gil = Python::acquire_gil();
    let py = gil.python();
    
    // Create a Python dictionary for results
    let results = PyDict::new(py);
    results.set_item("results", Vec::<String>::new())?;
    
    let metadata = PyDict::new(py);
    metadata.set_item("query", query)?;
    metadata.set_item("n_results", n_results)?;
    results.set_item("metadata", metadata)?;
    
    Ok(results.into())
}

#[pyfunction]
fn get_system_metrics() -> PyResult<PyObject> {
    let gil = Python::acquire_gil();
    let py = gil.python();
    
    let metrics = PyDict::new(py);
    let cpu = PyDict::new(py);
    let memory = PyDict::new(py);
    let gpu = PyDict::new(py);
    
    // CPU metrics
    if let Ok(output) = Command::new("top")
        .args(["-bn1"])
        .output()
    {
        if let Ok(output_str) = String::from_utf8(output.stdout) {
            if let Some(line) = output_str.lines().nth(2) {
                if let Some(cpu_usage) = line.split_whitespace().nth(8) {
                    if let Ok(usage) = cpu_usage.parse::<f64>() {
                        cpu.set_item("usage", usage)?;
                    }
                }
            }
        }
    }
    
    // Memory metrics
    if let Ok(output) = Command::new("free")
        .args(["-m"])
        .output()
    {
        if let Ok(output_str) = String::from_utf8(output.stdout) {
            if let Some(line) = output_str.lines().nth(1) {
                let parts: Vec<&str> = line.split_whitespace().collect();
                if parts.len() >= 4 {
                    if let (Ok(total), Ok(used)) = (parts[1].parse::<i64>(), parts[2].parse::<i64>()) {
                        memory.set_item("total", total)?;
                        memory.set_item("used", used)?;
                        memory.set_item("usage_percent", (used as f64 / total as f64) * 100.0)?;
                    }
                }
            }
        }
    }
    
    // GPU metrics
    if let Ok(output) = Command::new("nvidia-smi")
        .args(["--query-gpu=utilization.gpu,memory.used,memory.total", "--format=csv,noheader,nounits"])
        .output()
    {
        if let Ok(output_str) = String::from_utf8(output.stdout) {
            if let Some(line) = output_str.lines().next() {
                let parts: Vec<&str> = line.split(", ").collect();
                if parts.len() >= 3 {
                    if let (Ok(util), Ok(used), Ok(total)) = (
                        parts[0].trim().parse::<f64>(),
                        parts[1].trim().parse::<i64>(),
                        parts[2].trim().parse::<i64>()
                    ) {
                        gpu.set_item("utilization", util)?;
                        gpu.set_item("memory_used", used)?;
                        gpu.set_item("memory_total", total)?;
                        gpu.set_item("memory_usage_percent", (used as f64 / total as f64) * 100.0)?;
                    }
                }
            }
        }
    }
    
    metrics.set_item("cpu", cpu)?;
    metrics.set_item("memory", memory)?;
    metrics.set_item("gpu", gpu)?;
    
    Ok(metrics.into())
}

#[pyfunction]
fn get_ollama_models() -> PyResult<PyObject> {
    let gil = Python::acquire_gil();
    let py = gil.python();
    
    let output = Command::new("ollama")
        .args(["list"])
        .output()
        .map_err(|e| to_py_err(e, "Failed to execute ollama list command"))?;
    
    let output_str = String::from_utf8(output.stdout)
        .map_err(|e| to_py_err(e, "Failed to parse ollama output"))?;
    
    let models = PyList::new(py, []);
    for line in output_str.lines().skip(1) {
        let parts: Vec<&str> = line.split_whitespace().collect();
        if parts.len() >= 2 {
            let model = PyDict::new(py);
            model.set_item("name", parts[0])?;
            model.set_item("size", parts[1])?;
            models.append(model)?;
        }
    }
    
    let result = PyDict::new(py);
    result.set_item("models", models)?;
    
    Ok(result.into())
}

#[pyfunction]
fn execute_code(code: &str, timeout_ms: u64) -> PyResult<PyObject> {
    let gil = Python::acquire_gil();
    let py = gil.python();
    
    let temp_dir = tempfile::Builder::new()
        .prefix("code_exec_")
        .tempdir()
        .map_err(|e| io_to_py_err(e, "Failed to create temporary directory"))?;
    
    let code_path = temp_dir.path().join("code.py");
    fs::write(&code_path, code)
        .map_err(|e| io_to_py_err(e, "Failed to write code to temporary file"))?;
    
    let start_time = Instant::now();
    let output = Command::new("python3")
        .arg(&code_path)
        .output()
        .map_err(|e| io_to_py_err(e, "Failed to execute code"))?;
    
    let duration = start_time.elapsed();
    let stdout = String::from_utf8_lossy(&output.stdout);
    let stderr = String::from_utf8_lossy(&output.stderr);
    
    let result = PyDict::new(py);
    result.set_item("success", output.status.success())?;
    result.set_item("stdout", stdout.to_string())?;
    result.set_item("stderr", stderr.to_string())?;
    result.set_item("duration_ms", duration.as_millis())?;
    result.set_item("exit_code", output.status.code())?;
    
    Ok(result.into())
}

#[pyfunction]
fn analyze_code(code: &str) -> PyResult<PyObject> {
    let gil = Python::acquire_gil();
    let py = gil.python();
    
    let mut lines = 0;
    let mut functions = 0;
    let mut classes = 0;
    let mut complexity = 0;
    
    // Count lines
    lines = code.lines().count();
    
    // Count functions and classes
    for line in code.lines() {
        let line = line.trim();
        if line.starts_with("def ") {
            functions += 1;
        } else if line.starts_with("class ") {
            classes += 1;
        }
    }
    
    // Simple cyclomatic complexity calculation
    complexity = code.lines().fold(0, |acc, line| {
        let line = line.trim();
        acc + if line.contains("if ") || line.contains("for ") || line.contains("while ") || line.contains("except ") {
            1
        } else {
            0
        }
    });
    
    let result = PyDict::new(py);
    result.set_item("lines", lines)?;
    result.set_item("functions", functions)?;
    result.set_item("classes", classes)?;
    result.set_item("complexity", complexity)?;
    
    Ok(result.into())
}

#[pymodule]
fn code_assistant_rust(_py: Python<'_>, m: &PyModule) -> PyResult<()> {
    env_logger::init();
    m.add_function(wrap_pyfunction!(index_and_embed, m)?)?;
    m.add_function(wrap_pyfunction!(retrieve_chunks, m)?)?;
    m.add_function(wrap_pyfunction!(get_system_metrics, m)?)?;
    m.add_function(wrap_pyfunction!(get_ollama_models, m)?)?;
    m.add_function(wrap_pyfunction!(execute_code, m)?)?;
    m.add_function(wrap_pyfunction!(analyze_code, m)?)?;
    Ok(())
} 