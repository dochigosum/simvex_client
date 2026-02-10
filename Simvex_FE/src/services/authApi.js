import apiCall, { setAuthToken } from './api';

/**
 * 회원가입
 * POST /auth/join
 */
export const register = async (email, password) => {
  const response = await apiCall('/auth/join', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return response;
};

/**
 * 이메일 인증
 * POST /auth/join/verify
 */
export const verifyEmail = async (email, code) => {
  const response = await apiCall('/auth/join/verify', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
  return response;
};

/**
 * 로그인
 * POST /auth/login
 */
export const login = async (email, password) => {
  const response = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  // 토큰 저장
  if (response.token) {
    setAuthToken(response.token);
  }
  
  return response;
};

/**
 * 로그아웃
 * POST /auth/logout
 */
export const logout = async () => {
  const response = await apiCall('/auth/logout', {
    method: 'POST',
  });
  return response;
};
