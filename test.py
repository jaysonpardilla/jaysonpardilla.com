# python
"""
Simple test script to POST to the contact endpoint and print response details.
Usage:
  pip install requests
  BACKEND_URL="http://localhost:8000/contact-endpoint/" python test_contact.py
"""
import os, sys, json, traceback
import requests

URL = os.getenv("BACKEND_URL", "https://endpoint-pchg.onrender.com/contact-endpoint/")

payload = {
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test from test_contact.py"
}

headers = {"Accept": "application/json", "Content-Type": "application/json"}

try:
    print(f"POST -> {URL}")
    resp = requests.post(URL, json=payload, headers=headers, timeout=15)
    print("Status:", resp.status_code)
    print("Headers:", dict(resp.headers))
    # try JSON
    try:
        print("JSON response:", json.dumps(resp.json(), indent=2))
    except Exception:
        print("Text response:", resp.text)
    # print curl equivalent for manual retry
    curl = ("curl -i -X POST " + URL +
            " -H 'Content-Type: application/json' -d '" + json.dumps(payload) + "'")
    print("\nCurl equivalent:\n", curl)
    sys.exit(0 if resp.ok else 2)
except Exception as e:
    print("Request failed:", e)
    traceback.print_exc()
    sys.exit(3)