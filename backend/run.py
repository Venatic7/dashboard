import subprocess
import os
import webbrowser
from time import sleep

def start_servers():
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    frontend_dir = os.path.join(project_root, 'frontend')
    backend_dir = os.path.join(project_root, 'backend')

    print(f"Using directories:\nProject root: {project_root}\nFrontend: {frontend_dir}\nBackend: {backend_dir}")

    if not os.path.exists(frontend_dir):
        print(f"Frontend directory not found at: {frontend_dir}")
        return

    if not os.path.exists(backend_dir):
        print(f"Backend directory not found at: {backend_dir}")
        return

    frontend_process = subprocess.Popen(
        'npm run dev',
        shell=True,
        cwd=frontend_dir
    )

    backend_process = subprocess.Popen(
        'uvicorn main:app --reload',
        shell=True,
        cwd=backend_dir
    )

    sleep(5)
    webbrowser.open('http://localhost:3000')

    try:
        frontend_process.wait()
        backend_process.wait()
    except KeyboardInterrupt:
        frontend_process.terminate()
        backend_process.terminate()

if __name__ == '__main__':
    print("Starting development servers...")
    start_servers()
