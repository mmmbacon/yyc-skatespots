const AUTH_TOKEN_KEY = 'skatespot_auth_token';

export function getStoredToken() {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token) {
  try {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  } catch {
    // ignore private browsing / blocked storage
  }
}

export function clearStoredToken() {
  setStoredToken(null);
}
