import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendJoinCode, verifyEmail } from '../../services/authApi';
import './styles/auth.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [timer, setTimer] = useState(180);
  const [showPassword, setShowPassword] = useState(false);
  const [loadingSendCode, setLoadingSendCode] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    let interval;
    if (codeSent && !codeVerified && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [codeSent, codeVerified, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // 이메일 인증코드 전송 → POST /auth/join { email, password }
  const handleSendCode = async () => {
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: '이메일을 입력해주세요' }));
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: '사용할 수 없는 이메일입니다' }));
      return;
    }
    if (!formData.password || formData.password.length < 8) {
      setErrors(prev => ({ ...prev, password: '비밀번호를 먼저 8자리 이상 입력해주세요' }));
      return;
    }

    try {
      setLoadingSendCode(true);
      await sendJoinCode(formData.email, formData.password);
      setCodeSent(true);
      setTimer(180);
      console.log('✅ 인증코드 전송 성공');
    } catch (err) {
      console.error('인증코드 전송 실패:', err);
      // 백엔드에서 온 실제 에러 메시지 표시
      const errorMessage = err.response?.data?.message || '인증코드 전송에 실패했습니다. 다시 시도해주세요.';
      setErrors(prev => ({ ...prev, email: errorMessage }));
    } finally {
      setLoadingSendCode(false);
    }
  };

  // 인증코드 확인 → POST /auth/join/verify { email, code }
  const handleVerifyCode = async () => {
    if (!formData.code || formData.code.length !== 6) {
      setErrors(prev => ({ ...prev, email: '6자리 인증번호를 입력해주세요' }));
      return;
    }
    try {
      setLoadingVerify(true);
      await verifyEmail(formData.email, formData.code);
      setCodeVerified(true);
      console.log('✅ 이메일 인증 완료');
    } catch (err) {
      console.error('인증코드 확인 실패:', err);
      const errorMessage = err.response?.data?.message || '인증번호가 올바르지 않습니다.';
      setErrors(prev => ({ ...prev, email: errorMessage }));
    } finally {
      setLoadingVerify(false);
    }
  };

  // 최종 회원가입 제출 (인증이 완료된 상태면 바로 로그인 페이지로)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!codeVerified) {
      setErrors(prev => ({ ...prev, email: '이메일 인증을 완료해주세요.' }));
      return;
    }
    alert('회원가입이 완료되었습니다!');
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <button className="back-btn" onClick={() => navigate('/')}>
          ‹
        </button>

        <h1 className="auth-title">sign up</h1>

        <form onSubmit={handleSubmit}>
          {/* 1. 비밀번호 먼저 입력 */}
          <div className="form-group">
            <label className="form-label">비밀번호</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="비밀번호를 입력해주세요 (8자리 이상)"
                required
                disabled={codeSent}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img
                  src={showPassword ? '/icons/눈_on.png' : '/icons/눈_off.png'}
                  alt={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                />
              </button>
            </div>
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>

          {/* 2. 이메일 입력 + 코드 전송 */}
          <div className="form-group">
            <label className="form-label">이메일</label>
            <div className="code-input-wrapper">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="이메일을 입력해주세요"
                required
                disabled={codeSent}
              />
              <button
                type="button"
                className="code-send-btn"
                onClick={handleSendCode}
                disabled={codeSent || loadingSendCode}
              >
                {loadingSendCode ? '전송 중...' : codeSent ? '전송됨' : '코드 전송'}
              </button>
            </div>
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          {/* 3. 인증번호 입력 */}
          {codeSent && (
            <div className="form-group">
              <div className="code-verification-wrapper">
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="form-input code-input"
                  placeholder="인증번호를 입력해주세요 (숫자 6자리)"
                  maxLength={6}
                  required
                  disabled={codeVerified}
                />
                {!codeVerified && (
                  <span className="code-timer">{formatTime(timer)}</span>
                )}
              </div>
              {!codeVerified ? (
                <button
                  type="button"
                  className="code-send-btn"
                  onClick={handleVerifyCode}
                  disabled={loadingVerify}
                  style={{ marginTop: '8px', width: '100%' }}
                >
                  {loadingVerify ? '확인 중...' : '인증번호 확인'}
                </button>
              ) : (
                <p style={{ color: '#4ade80', fontSize: '13px', marginTop: '6px' }}>
                  ✅ 이메일 인증 완료
                </p>
              )}
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={loadingSubmit}>
            {loadingSubmit ? '처리 중...' : '회원가입'}
          </button>
        </form>

        <p className="auth-link-text">
          계정이 있으신가요? <Link to="/login" className="auth-link">로그인</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
