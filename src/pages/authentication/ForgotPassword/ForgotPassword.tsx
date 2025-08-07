import backgroundImage from '../../../assets/images/authentication/forgotPassword-background.png';
import Logo from '../../../assets/images/logo.svg';
import './ForgotPassword.css';
import TextInput from '../../../componets/forms/inputs/TextInput/TextInput';
import { useState, type FormEvent } from 'react';
import { forgotPassword } from '../../../apis/forgotPassword';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ForgotPassword() {
   const [email, setEmail] = useState<string>('');
   const [emailError, setEmailError] = useState<string | null>(null);
     const [errorMessage, setErrorMessage] = useState<string | null>(null);
     const [isLoading, setIsLoading] = useState<boolean>(false);
     const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
     const navigate = useNavigate();

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

    const loginPage = () => {
    navigate('/');
  };

    const validateForm = (): boolean => {
    const emailValidationError = validateEmail(email);   
    
    setEmailError(emailValidationError);   
    
    return !emailValidationError ;
  };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage(null);
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await forgotPassword({ username: email.toLowerCase() });
      setIsSubmitted(true);
      
      console.log('Email send successfully:', response);
      setErrorMessage(null);

  
    } catch (err) {
     let backendMsg = 'Failed to send email. Please try again.';

    if (axios.isAxiosError(err)) {
      backendMsg =
        err.response?.data?.message ??
        err.response?.data ??               
        err.message;
    } else if (err instanceof Error) {
      backendMsg = err.message;
    }

    setErrorMessage(backendMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-main-container">
      <div
        className="forgot-password-left-div"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="forgot-password-copyright-text">
          © 2025 American Virtual Monitoring
        </div>
      </div>
      <div className="forgot-password-right-div">
        <div className="forgot-password-box-container">
          <img src={Logo} alt="American Virtual Monitoring Logo" className="forgot-password-logo" />
          {!isSubmitted ? (
            <>
          <p className="welcome-text">
            Enter your email for the verification process, we will send the password reset link to your email.
          </p>
          <form className="forgot-password-form" noValidate onSubmit={handleSubmit} >
            <div className="forgot-password-form-group">
              <label htmlFor="email">Email</label>
              <TextInput
                name="email"
                id="email"
                placeholder="Enter your Email"
                type="email"
                autoComplete="email"                
                value={email}
                onChange={handleEmailChange}
                required
                className={`Login-TextInput-input ${emailError ? 'error' : ''}`}
              />
              {emailError && <div className="validation-error">{emailError}</div>}
            </div>
            <button
              type="submit"
              className="forgot-password-button"             
            > {isLoading ? 'Sending email...' : 'Continue'}
              
            </button>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <span className="go-back-link" onClick={loginPage}>Go Back</span>
          </form>
           
            </>
          ) : (
                    <>
              <p className="success-message">Password reset link has been shared successfully</p>
              <button className="forgot-password-button" onClick={loginPage}>
                Continue
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
