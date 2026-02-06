import sys
import os

def main():
    print(f"Python Executable: {sys.executable}")
    print(f"Project Root: {os.getcwd()}")
    # Kontrola, zda jsme ve správném venv
    if ".venvs/Antigravity" in sys.executable:
        print("✅ SUCCESS: Running in isolated Antigravity environment.")
    else:
        print("❌ ERROR: Running in system Python!")

if __name__ == "__main__":
    main()