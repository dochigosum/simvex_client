// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.simvex.com/api/v1';

// 로그인 없이 접근 가능한 엔드포인트 (토큰 없어도 OK)
const PUBLIC_ENDPOINTS = ['/auth/login', '/auth/join', '/auth/join/verify'];

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
  const isPublic = PUBLIC_ENDPOINTS.some(pub => endpoint.startsWith(pub));

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

    // 401 Unauthorized - 공개 엔드포인트가 아닐 때만 로그인 페이지로
    if (response.status === 401 && !isPublic) {
      removeAuthToken();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      // 에러 응답 바디도 읽어서 로그에 출력
      let errorData = null;
      try {
        const errorText = await response.text();
        console.error(`API 에러 응답 바디 [${endpoint}]:`, errorText);
        errorData = JSON.parse(errorText);
      } catch (_) {}
      
      const error = new Error(`API Error: ${response.status}`);
      error.response = { 
        data: errorData, 
        status: response.status 
      };
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
};

export default apiCall;
