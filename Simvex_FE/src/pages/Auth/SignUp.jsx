import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const [timer, setTimer] = useState(180);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let interval;
    if (codeSent && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [codeSent, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleSendCode = () => {
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: '이메일을 입력해주세요' }));
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: '사용할 수 없는 이메일입니다' }));
      return;
    }

    setCodeSent(true);
    setTimer(180);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password.length < 8) {
      setErrors(prev => ({ ...prev, password: '8자리 이상 입력해주세요' }));
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
              />
              <button
                type="button"
                className="code-send-btn"
                onClick={handleSendCode}
                disabled={codeSent}
              >
                코드 전송
              </button>
            </div>
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

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
                />
                <span className="code-timer">{formatTime(timer)}</span>
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">비밀번호</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="비밀번호를 입력해주세요"
                required
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

          <button type="submit" className="auth-submit-btn">
            회원가입
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
