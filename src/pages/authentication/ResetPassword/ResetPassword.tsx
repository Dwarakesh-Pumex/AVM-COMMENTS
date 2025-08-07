import backgroundImage from '../../../assets/images/authentication/resetPassword-background.png';
import Logo from '../../../assets/images/logo.svg';
import './ResetPassword.css';

import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../../../apis/resetPassword';
import PasswordInput from '../../../componets/forms/inputs/PasswordInput/PasswordInput';

// Define the error type
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [search] = useSearchParams();
  const token = search.get('token') ?? '';

  const passwordRules =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_~^])[A-Za-z\d@$!%*?#&_~^]{8,}$/;

  const validate = (): boolean => {
    let ok = true;

    if (!passwordRules.test(password)) {
      setPasswordError(
        'Min 8 chars, upper, lower, number & special char required'
      );
      ok = false;
    } else {
      setPasswordError(null);
    }

    if (password !== confirmPassword) {
      setConfirmError('Passwords do not match');
      ok = false;
    } else {
      setConfirmError(null);
    }

    return ok;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) return;

    setIsLoading(true);
    try {
      await resetPassword({ token, newPassword: password });
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      setErrorMessage(
        (err as ApiError)?.response?.data?.message ?? 'Failed to reset password'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();

  const loginPage = () => {
    navigate('/');
  };

  return (
    <div className="reset-password-main-container">
      <div
        className="reset-password-left-div"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="reset-password-copyright-text">
          © 2025 American Virtual Monitoring
        </div>
      </div>
      <div className="reset-password-right-div">
        <div className="reset-password-box-container">
          <img src={Logo} alt="American Virtual Monitoring Logo" className="reset-password-logo" />
          {!isSubmitted ? (
            <>
              <p className="reset-password-heading">
                Set the new password for your account
              </p>
              <form className="reset-password-form" noValidate onSubmit={handleSubmit}>
                <div className="reset-password-form-group">
                  <label htmlFor="password">New Password</label>
                  <div className="password-wrapper">
                    <PasswordInput
                      id="password"
                      name="password"
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={passwordError ? 'error' : undefined}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                  {passwordError && (
                    <div className="validation-error">{passwordError}</div>
                  )}
                </div>

                <div className="reset-password-form-group">
                  <label htmlFor="confirmPassword">Confirm New Password*</label>
                  <div className="password-wrapper">
                    <PasswordInput
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="********"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={confirmError ? 'error' : undefined}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                  {confirmError && (
                    <div className="validation-error">{confirmError}</div>
                  )}
                </div>
                <button
                  type="submit"
                  className="reset-password-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing…' : 'Continue'}
                </button>

                {errorMessage && (
                  <div className="error-message">{errorMessage}</div>
                )}

                <span className="go-back-link" onClick={loginPage}>Go Back</span>
              </form>
            </>
          ) : (
            <>
              <p className="success-message">Password has been successfully reset</p>
              <button className="reset-password-button" onClick={loginPage}>
                Continue
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;