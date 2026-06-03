export function applyAuthSession(dispatch, { token, user }) {
  dispatch({ type: 'SET_ID_TOKEN', payload: token });
  dispatch({ type: 'LOGIN_USER', payload: user });
  dispatch({ type: 'IS_LOGGED_IN', payload: true });
}
