export const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

export const clearAuthToken = () => {
  localStorage.removeItem('auth_token');
};

export const setAuthUsername = (username: string) => {
  localStorage.setItem('username', username);
};

export const getAuthUsername = () => {
  return localStorage.getItem('username');
};

export const clearAuthUsername = () => {
  localStorage.removeItem('username');
};
