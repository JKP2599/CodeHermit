"""
Streamlit UI for Local Code Assistant
"""
import streamlit as st
import requests
import json
import psutil
import subprocess
from datetime import datetime

def get_available_models():
    try:
        result = subprocess.run(['ollama', 'list'], capture_output=True, text=True)
        if result.returncode == 0:
            lines = result.stdout.strip().split('\n')[1:]  # Skip header
            models = [line.split()[0] for line in lines if line.strip()]
            return models
        return []
    except Exception as e:
        st.error(f"Error getting Ollama models: {str(e)}")
        return []

def get_metrics():
    """Get system metrics"""
    metrics = {
        "cpu_percent": psutil.cpu_percent(),
        "memory_percent": psutil.virtual_memory().percent,
        "gpu_metrics": {}
    }
    
    try:
        nvidia_smi = subprocess.check_output([
            "nvidia-smi", "--query-gpu=utilization.gpu,memory.used,memory.total",
            "--format=csv,noheader,nounits"
        ])
        gpu_metrics = nvidia_smi.decode().strip().split(",")
        metrics["gpu_metrics"] = {
            "utilization": float(gpu_metrics[0]),
            "memory_used": float(gpu_metrics[1]),
            "memory_total": float(gpu_metrics[2])
        }
    except:
        pass
    
    return metrics

def generate_code(prompt, model):
    """Generate code using the API"""
    try:
        response = requests.post(
            "http://localhost:8000/generate",
            json={"prompt": prompt, "model": model}
        )
        return response.json()
    except Exception as e:
        return {"error": str(e)}

def review_code(code, model):
    """Review code using the API"""
    try:
        response = requests.post(
            "http://localhost:8000/review",
            json={"prompt": code, "model": model}
        )
        return response.json()
    except Exception as e:
        return {"error": str(e)}

def send_chat(message, model):
    """Send chat message using the API"""
    try:
        response = requests.post(
            "http://localhost:8000/chat",
            json={"message": message, "model": model}
        )
        return response.json()
    except Exception as e:
        return {"error": str(e)}

# Configure the page
st.set_page_config(
    page_title="Local Code Assistant",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main {
        background-color: #0e1117;
        color: #ffffff;
    }
    .stTabs [data-baseweb="tab-list"] {
        gap: 2rem;
        display: flex;
        justify-content: space-between;
    }
    .stTabs [data-baseweb="tab"] {
        height: 4rem;
        white-space: pre-wrap;
        background-color: #252d3d;
        border-radius: 4px 4px 0 0;
        gap: 1rem;
        padding-top: 10px;
        padding-bottom: 10px;
        flex: 1;
    }
    .stTabs [aria-selected="true"] {
        background-color: #2e2e2e;
    }
    .stTabs [data-baseweb="tab-panel"] {
        background-color: #252d3d;
        border-radius: 0 0 4px 4px;
        padding: 1rem;
    }
    .code-block {
        background-color: #1e1e1e;
        padding: 1rem;
        border-radius: 4px;
        color: #ffffff;
    }
    .metric-card {
        background-color: #252d3d;
        padding: 1rem;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'chat_history' not in st.session_state:
    st.session_state.chat_history = []

# Sidebar
with st.sidebar:
    st.title("🤖 Local Code Assistant")
    st.markdown("---")
    available_models = get_available_models()
    if not available_models:
        st.warning("No Ollama models found. Use 'ollama pull <model>' to add models.")
        st.stop()
    model = st.selectbox("Select Model", available_models, index=0)
    st.markdown(f"<div style='font-size:0.8em;color:#666;margin-top:0.5em;'>Using model: {model}</div>", unsafe_allow_html=True)
    
    # System metrics
    st.markdown("### System Metrics")
    metrics = get_metrics()
    
    col1, col2 = st.columns(2)
    with col1:
        st.metric("CPU Usage", f"{metrics['cpu_percent']}%")
    with col2:
        st.metric("Memory Usage", f"{metrics['memory_percent']}%")
    
    if metrics['gpu_metrics']:
        st.markdown("### GPU Metrics")
        col3, col4 = st.columns(2)
        with col3:
            st.metric("GPU Usage", f"{metrics['gpu_metrics']['utilization']}%")
        with col4:
            st.metric(
                "GPU Memory",
                f"{metrics['gpu_metrics']['memory_used']}MB / {metrics['gpu_metrics']['memory_total']}MB"
            )

# Main content
st.title("Local Code Assistant")

# Create tabs
tab1, tab2, tab3 = st.tabs(["Generate Code", "Review Code", "Chat"])

# Generate Code Tab
with tab1:
    st.markdown("### Generate Code")
    prompt = st.text_area(
        "Enter your code generation prompt",
        placeholder="Example: Create a Python function to calculate the Fibonacci sequence",
        height=100
    )
    
    if st.button("Generate Code", type="primary"):
        with st.spinner("Generating code..."):
            result = generate_code(prompt, model)
            if "error" in result:
                st.error(result["error"])
            else:
                st.markdown("### Generated Code")
                st.code(result.get("code", ""), language="python")
                
                if "issues" in result and result["issues"]:
                    st.markdown("### Review Comments")
                    for issue in result["issues"]:
                        st.info(issue)

# Review Code Tab
with tab2:
    st.markdown("### Review Code")
    code = st.text_area(
        "Enter code to review",
        placeholder="Paste your code here...",
        height=200
    )
    
    if st.button("Review Code", type="primary"):
        with st.spinner("Reviewing code..."):
            result = review_code(code, model)
            if "error" in result:
                st.error(result["error"])
            else:
                st.markdown("### Review Results")
                if "issues" in result and result["issues"]:
                    for issue in result["issues"]:
                        st.info(issue)
                else:
                    st.success("No issues found!")

# Chat Tab
with tab3:
    st.markdown("### Chat with Assistant")
    
    # Display chat history
    for message in st.session_state.chat_history:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
    
    # Chat input
    if prompt := st.chat_input("Type your message here..."):
        # Add user message to chat history
        st.session_state.chat_history.append({"role": "user", "content": prompt})
        
        # Display user message
        with st.chat_message("user"):
            st.markdown(prompt)
        
        # Get and display assistant response
        with st.chat_message("assistant"):
            with st.spinner("Thinking..."):
                response = send_chat(prompt, model)
                if "error" in response:
                    st.error(response["error"])
                else:
                    st.markdown(response.get("response", ""))
                    # Add assistant response to chat history
                    st.session_state.chat_history.append({
                        "role": "assistant",
                        "content": response.get("response", "")
                    })

# Auto-refresh metrics
if st.button("Refresh Metrics"):
    st.rerun() 