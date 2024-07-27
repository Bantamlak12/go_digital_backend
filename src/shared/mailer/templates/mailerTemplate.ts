export function generatePasswordResetEmail(resetUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      color: #333333;
    }
    .email-container {
      width: 100%;
      padding: 20px;
      background-color: #f9f9f9;
    }
    .email-content {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      text-align: center;
      margin-bottom: 20px;
    }
    .email-header h1 {
      color: #007BFF;
      font-size: 24px;
      margin: 0;
    }
    .email-body {
      font-size: 16px;
      color: #333333;
    }
    .email-body p {
      line-height: 1.5;
    }
    .email-footer {
      text-align: center;
      margin-top: 20px;
    }
    .reset-button {
      display: inline-block;
      padding: 10px 20px;
      font-size: 16px;
      color: #ffffff;
      background-color: #007BFF;
      border: none;
      border-radius: 5px;
      text-decoration: none;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-content">
      <div class="email-header">
        <h1>Password Reset</h1>
      </div>
      <div class="email-body">
        <p>You requested a password reset. Click the button or use the link below to reset your password.
        The link is only valid for an hour.</p>
        <p style="text-align: center;">
          <a href="${resetUrl}" class="reset-button">Reset password</a>
        </p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you did not request this, please ignore this email.</p>
      </div>
      <div class="email-footer">
        <p>Thank you,<br>Go Digital Technology</p>
      </div>
    </div>
  </div>
</body>
</html>
`;
}
