export const messages = {
  errors: {
    handle_error: "Unhandled error: ",
    access_denied: "Access denied. Incorrect username or password.",
    access_error: "Unhandled error while logging in.",
    zod_username_required: "Username is required.",
    zod_password_required: "Password is required.",
    zod_code_required: "Verification code is required.",
  },
  success: {
    access_success: "Access granted successfully ",
    access_loading: "Logging in...",
    mfa_activation_success: "Multi-factor authentication activated successfully.",
    mfa_qr_code: "QR code generated successfully.",
    mfa_code_sent: "Code sent to email successfully.",
    mfa_validation_success: "Multi-factor authentication validation successful.",
  },
  ui: {
      login_welcome: "Welcome to Gesinova",
      login_username: "Username",
      login_password: "Password",
      login_forgot_password: "Forgot your password?",
      login_submit: "Log in",
      login_submiting: "Logging in...",
      login_remember_me: "Remember me",
      mfa_validation_back: "Back to login",
      mfa_validation_send_code: "Send code",
      mfa_validation_code: "Enter the verification code sent to your email",
      mfa_validation_wait: "Please wait...",
      mfa_validation_card_title: "Multi-factor Authentication Validation",
      mfa_validation_card_subtitle: "Enter the verification code sent to your email",
  }
};