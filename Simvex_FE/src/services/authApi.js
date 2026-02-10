import apiCall, { setAuthToken } from './api';

/**
 * 회원가입 1단계: 이메일 + 비밀번호 전송 → 인증코드 이메일 발송
 * POST /auth/join
 * body: { email, password }
 */
export const sendJoinCode = async (email, password) => {
  const response = await apiCall('/auth/join', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return response;
};

/**
 * 회원가입 2단계: 인증코드 확인 → 최종 가입 완료
 * POST /auth/join/verify
 * body: { email, code }
 */
export const verifyEmail = async (email, code) => {
  const response = await apiCall('/auth/join/verify', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
  return response;
};

/** @deprecated sendJoinCode 사용 */
export const register = sendJoinCode;

/**
 * 로그인
 * POST /auth/login
 */
export const login = async (email, password) => {
  const response = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  // 응답 전체 확인용 로그 (연동 확인 후 제거 가능)
  console.log('🔑 로그인 응답 전체:', response);

  // 백엔드 응답 필드명에 따라 토큰 저장 (여러 케이스 대응)
  const token = response.token
    || response.access_token
    || response.accessToken
    || response.jwt
    || response.data?.token
    || response.data?.access_token;

  if (token) {
    setAuthToken(token);
    console.log('✅ 토큰 저장 완료');
  } else {
    console.warn('⚠️ 토큰을 찾을 수 없음. 응답 구조를 확인하세요:', Object.keys(response));
  }

  // user_id도 여러 필드명 대응
  const userId = response.user_id
    || response.userId
    || response.id
    || response.data?.user_id
    || response.data?.id;

  if (userId) {
    localStorage.setItem('user_id', userId);
    console.log('✅ user_id 저장 완료:', userId);
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
