import hashlib
import hmac
import json
import os
from urllib.parse import parse_qsl

from .config import settings

def validate_init_data(init_data: str, bot_token: str = settings.TELEGRAM_BOT_TOKEN) -> dict | None:
    """
    Validates the initData string from Telegram WebApp.
    Returns the parsed user data if valid, None otherwise.
    """
    try:
        parsed_data = dict(parse_qsl(init_data))
    except ValueError:
        return None

    if "hash" not in parsed_data:
        return None

    received_hash = parsed_data.pop("hash")
    
    # Sort keys alphabetically
    data_check_string = "\n".join(f"{k}={v}" for k, v in sorted(parsed_data.items()))
    
    # Calculate secret key
    secret_key = hmac.new(b"WebAppData", bot_token.encode(), hashlib.sha256).digest()
    
    # Calculate hash
    calculated_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    
    if calculated_hash == received_hash:
        # Data is valid, return the user object
        user_data_json = parsed_data.get("user")
        if user_data_json:
            return json.loads(user_data_json)
        return {}
    
    return None
