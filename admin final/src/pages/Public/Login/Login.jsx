import { useState, useRef, useCallback } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const handleShowPassword = useCallback(() => {
    setIsShowPassword((prev) => !prev);
  }, []);

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
    setError(''); // Clear error on input change
  };

  const validateFields = () => {
    const { email, password } = formState;
    return email.trim() && password.trim();
  };

  const handleLogin = async () => {
    if (!validateFields()) {
      setError('Both email and password are required!');
      if (!formState.email) emailRef.current.focus();
      if (!formState.password) passwordRef.current.focus();
      return;
    }

    setStatus('loading');
    try {
      const response = await axios.post('/admin/login', formState);
      localStorage.setItem('accessToken', response.data.access_token);
      navigate('/main/movies');
    } catch (error) {
      console.error(error);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="Login">
      <div className="main-container">
        <h3>Login</h3>
        <form>
          <div className="form-container">
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">E-mail:</label>
              <input
                type="text"
                id="email"
                name="email"
                ref={emailRef}
                value={formState.email}
                onChange={handleOnChange}
                placeholder="Enter your email"
              />
            </div>


            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type={isShowPassword ? 'text' : 'password'}
                id="password"
                name="password"
                ref={passwordRef}
                value={formState.password}
                onChange={handleOnChange}
                placeholder="Enter your password"
              />
            </div>


            <div
              className="show-password"
              onClick={handleShowPassword}
              aria-label="Toggle password visibility"
            >
              {isShowPassword ? 'Hide' : 'Show'} Password
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="submit-container">
              <button
                className="btn-primary"
                type="button"
                disabled={status === 'loading'}
                onClick={handleLogin}
              >
                {status === 'loading' ? 'Logging in...' : 'Login'}
              </button>
            </div>

            <div className="register-container">
              <small>Don't have an account? </small>
              <a href="/register">
                <small>Register</small>
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
