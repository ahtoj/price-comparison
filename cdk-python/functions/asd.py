from google.oauth2 import id_token
from google.auth.transport import requests

# pip install requests
# pip install google-auth

# Replace YOUR_CLIENT_ID with your actual Google OAuth 2.0 client ID
CLIENT_ID = ""

def validate_token(token):
    try:
        # Verify the token against the CLIENT_ID
        id_info = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)

        # If verification is successful, return the token's payload
        return id_info
    except ValueError as e:
        # Token is invalid
        print("Token validation failed:", e)
        return None

# Example usage
if __name__ == "__main__":
    jwt_token = ""

    payload = validate_token(jwt_token)
    if payload:
        print("Token is valid.")
        print("User ID:", payload.get("sub"))
        print("User Email:", payload.get("email"))
        # You can extract more information from the payload as needed
    else:
        print("Token is not valid.")