import { useState } from "react";
import "./ChangePassword.css";
import PageHeader from "../../../componets/UI/PageHeader/PageHeader";
import Sidebar from "../../../componets/UI/Sidebar/Sidebar";
import PasswordInput from '../../../componets/UI/inputs/PasswordInput/PasswordInput';
import Button from '../../../componets/UI/Button/Button';
import { changePassword } from "../../../apis/changePassword";
import type { ChangePasswordRequest } from "../../../types/changePassword";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const getPasswordValidations = (password: string) => {
    const validations = [];
    if (password.length < 8) {
      validations.push("Password must contain at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      validations.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      validations.push("Password must contain at least one lowercase letter");
    }
    if (!/\d/.test(password)) {
      validations.push("Password must contain at least one number");
    }
    if (!/[!@#$%&*]/.test(password)) {
      validations.push("Password must contain at least one special character (!@#$%&*)");
    }
    return validations;
  };

  const validatePassword = (password: string): string => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%&*]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter";
    }
    if (!hasLowerCase) {
       return "Password must contain at least one lowercase letter";
    }
    if (!hasNumber) {
      return "Password must contain at least one number";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character (!@#$%&*)";
    }
    return "";
  };

  const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value);
    setCurrentPasswordError("");
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    setNewPasswordError("");
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");

    // Check for empty fields
    let hasError = false;
    if (!currentPassword) {
      setCurrentPasswordError("*Current password is required");
      hasError = true;
    }
    if (!newPassword) {
      setNewPasswordError("*New password is required");
      hasError = true;
    }
    if (!confirmPassword) {
      setConfirmPasswordError("*Confirm password is required");
      hasError = true;
    }
    if (hasError) {
      return;
    }

    // Check if current password and new password are the same
    if (currentPassword === newPassword) {
      alert("Current Password and New Password are same");
      return;
    }

    const passwordValidationError = validatePassword(newPassword);
    if (passwordValidationError) {
      setNewPasswordError(passwordValidationError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("New password and Confirm New Password do not match");
      return;
    }

    setIsLoading(true);
    try {
      const request: ChangePasswordRequest = {
        oldPassword: currentPassword,
        newPassword: newPassword
      };
      await changePassword(request);
      alert("Password reset successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setNewPasswordFocused(false);
      setConfirmPasswordFocused(false);
    } catch {
      alert("Failed to change password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setCurrentPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");
    setNewPasswordFocused(false);
    setConfirmPasswordFocused(false);
  };

  return (
    <div className="change-password-main-container">
      <div className="change-password-left-div">
        <Sidebar />
      </div>
      <div className="change-password-right-div">
        <PageHeader
          title="Dashboard"
          showHeaderRow1Only={true}
        />

        
        <div className="change-password-right-bottom-div">
          <div className="change-password-container">
            <p className="change-password-container-title">Update your password to keep your account secure</p>
            <form className="change-password-form" onSubmit={handleSubmit} noValidate>
              <div className="change-password-form-group">
                <label htmlFor="current-password">Current Password*</label>
                <PasswordInput
                  name="current-password"
                  id="current-password"
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChange={handleCurrentPasswordChange}
                  required
                  autoComplete="current-password"
                  className={`ChangePassword-PasswordInput-input ${currentPasswordError ? 'error' : ''}`}
                />
                {currentPasswordError && <div className="change-password-validation-error">{currentPasswordError}</div>}
              </div>

              <div className="change-password-form-group">
                <label htmlFor="new-password">New Password*</label>
                <div
                  onFocus={() => setNewPasswordFocused(true)}
                  onBlur={() => setNewPasswordFocused(false)}
                >
                  <PasswordInput
                    name="new-password"
                    id="new-password"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    required
                    autoComplete="new-password"
                    className={`ChangePassword-PasswordInput-input ${newPasswordError ? 'error' : ''}`}
                  />
                </div>
                {newPassword && newPasswordFocused && getPasswordValidations(newPassword).length > 0 && (
                  <div className="change-password-validation-messages">
                    {getPasswordValidations(newPassword).map((message, index) => (
                      <div key={index} className="change-password-validation-message">
                        {message}
                      </div>
                    ))}
                  </div>
                )}
                {newPasswordError && !newPasswordFocused && <div className="change-password-validation-error">{newPasswordError}</div>}
              </div>

              <div className="change-password-form-group">
                <label htmlFor="confirm-password">Confirm New Password*</label>
                <div
                  onFocus={() => setConfirmPasswordFocused(true)}
                  onBlur={() => setConfirmPasswordFocused(false)}
                >
                  <PasswordInput
                    name="confirm-password"
                    id="confirm-password"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                    autoComplete="new-password"
                    className={`ChangePassword-PasswordInput-input ${confirmPasswordError ? 'error' : ''}`}
                  />
                </div>
                {confirmPassword && confirmPasswordFocused && (getPasswordValidations(confirmPassword).length > 0 || newPassword !== confirmPassword) && (
                  <div className="change-password-validation-messages">
                    {getPasswordValidations(confirmPassword).map((message, index) => (
                      <div key={index} className="change-password-validation-message">
                        {message}
                      </div>
                    ))}
                    {newPassword !== confirmPassword && (
                      <div className="change-password-validation-message">
                        New password and Confirm New Password do not match
                      </div>
                    )}
                  </div>
                )}
                {confirmPasswordError && !confirmPasswordFocused && <div className="change-password-validation-error">{confirmPasswordError}</div>}
              </div>
              <div className="change-password-buttons-div">
                <Button
                  label="Update"
                  variant="primary"
                  type="submit"
                  disabled={isLoading}
                />
                <Button
                  label="Cancel"
                  variant="secondary"
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;