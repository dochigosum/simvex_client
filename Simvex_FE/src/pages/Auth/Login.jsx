import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.email && formData.password) {
      if (formData.password.length < 8) {
        setError('이메일 또는 비밀번호가 일치하지 않습니다');
        return;
      }
      navigate('/');
    } else {
      setError('이메일 또는 비밀번호가 일치하지 않습니다');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <button className="back-btn" onClick={() => navigate('/')}>
          ‹
        </button>

        <h1 className="auth-title">sign in</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">이메일</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="이메일을 입력해주세요"
              required
            />
          </div>

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
            {error && <p className="error-message">{error}</p>}
          </div>

          <button type="submit" className="auth-submit-btn">
            로그인
          </button>
        </form>

        <p className="auth-link-text">
          계정이 없으신가요? <Link to="/signup" className="auth-link">회원가입</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
