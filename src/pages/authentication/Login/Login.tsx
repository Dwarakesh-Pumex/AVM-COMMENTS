
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../../assets/images/authentication/login-background2.png';
import Logo from '../../../assets/images/logo.svg';
import './Login.css';
import TextInput from '../../../componets/UI/inputs/TextInput/TextInput';
import PasswordInput from '../../../componets/UI/inputs/PasswordInput/PasswordInput';
import { login } from '../../../apis/login/index';
import Cookies from 'js-cookie';

function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  const validateEmail = (email: string): string | null => {
    if (!email.trim()) {
      return '*Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.toLowerCase())) {
      return 'Please enter a valid email address';
    }
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password.trim()) {
      return '*Password is required';
    }
    return null;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    if (emailError) {
      setEmailError(null);
    }
    
    if (value.trim()) {
      const error = validateEmail(value);
      setEmailError(error);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (passwordError) {
      setPasswordError(null);
    }
    
    if (value.trim()) {
      const error = validatePassword(value);
      setPasswordError(error);
    }
  };

  const handleKeepLoggedInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeepLoggedIn(e.target.checked);
  };

  const validateForm = (): boolean => {
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);
    
    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);
    
    return !emailValidationError && !passwordValidationError;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage(null);
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await login({ username: email.toLowerCase(), password });
      
      if (keepLoggedIn) {
        const cookieOptions = { expires: 7 };
        Cookies.set('accessToken', response.accessToken, cookieOptions);
        Cookies.set('refreshToken', response.refreshToken, cookieOptions);
        Cookies.set('role', response.role, cookieOptions);
        Cookies.set('fullname', response.fullname, cookieOptions);
        Cookies.set('username', response.username, cookieOptions); // Store username for refresh
      } else {
        Cookies.set('accessToken', response.accessToken);
        Cookies.set('refreshToken', response.refreshToken);
        Cookies.set('role', response.role);
        Cookies.set('fullname', response.fullname);
        Cookies.set('username', response.username); // Store username for refresh
      }

      console.log('Login successful:', response);
      setErrorMessage(null);

      switch (response.role.toLowerCase()) {
        case 'role_admin':
          navigate('/comment-page');
          break;
        case 'role_supervisor':
          navigate('/comment-page');
          break;
        case 'role_staff':
          navigate('/comment-page');
          break;
        case 'role_customer':
          navigate('/comment-page');
          break;
        default:
          navigate('/login');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage('Invalid login credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordClick = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="login-main-container">
      <div className="login-left-div">
        <div className="login-box-container">
          <img src={Logo} alt="American Virtual Monitoring Logo" className="login-logo" />
          <p className="welcome-text">Welcome to American Virtual Monitoring</p>
          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="login-form-group">
              <label htmlFor="email">Email</label>
              <TextInput
                name="email"
                id="email"
                placeholder="Enter your Email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                autoComplete="email"
                className={`Login-TextInput-input ${emailError ? 'error' : ''}`}
              />
              {emailError && <div className="validation-error">{emailError}</div>}
            </div>
            
            <div className="login-form-group">
              <label htmlFor="password">Password</label>
              <PasswordInput
                name="password"
                id="password"
                placeholder="Enter your Password"
                value={password}
                onChange={handlePasswordChange}
                required
                autoComplete="current-password"
                className={`Login-PasswordInput-input ${passwordError ? 'error' : ''}`}
              />
              {passwordError && <div className="validation-error">{passwordError}</div>}
            </div>
            
            <span className="forgot-password" onClick={handleForgotPasswordClick}>Forgot Password?</span>
            
            <button 
              type="submit" 
              className="login-button"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            
            <label className="keep-logged-in" htmlFor="keep-logged-in">
              <input 
                type="checkbox" 
                id="keep-logged-in" 
                className="keep-logged-in-checkbox" 
                checked={keepLoggedIn}
                onChange={handleKeepLoggedInChange}
              /> 
              Keep me logged in
            </label>
          </form>
        </div>
      </div>
      <div
        className="login-right-div"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="login-copyright-text">
          © 2025 American Virtual Monitoring
        </div>
      </div>
    </div>
  );
}

export default Login;