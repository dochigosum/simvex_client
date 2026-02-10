// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.simvex.com/api/v1';

// 토큰 관리
export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

export const setAuthToken = (token) => {
  localStorage.setItem('auth_token', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('auth_token');
};

// API 호출 헬퍼
const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const defaultHeaders = {
    ...options.headers,
  };
  
  // FormData가 아닌 경우에만 Content-Type 추가
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: defaultHeaders,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // 401 Unauthorized - 로그인 페이지로 리다이렉트
    if (response.status === 401) {
      removeAuthToken();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
};

export default apiCall;
