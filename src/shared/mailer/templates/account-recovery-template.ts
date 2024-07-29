export function generateAccountRecoveryEmail(
  userName: string,
  restorationLink: string,
  year: number,
): string {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Account Deletion Notice</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #007bff;
        color: #ffffff;
        padding: 10px;
        text-align: center;
        border-radius: 8px 8px 0 0;
      }
      .header h1 {
        margin: 0;
      }
      .content {
        margin: 20px 0;
      }
      .content p {
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        padding: 10px 20px;
        font-size: 16px;
        color: #ffffff;
        background-color: #007bff;
        text-decoration: none;
        border-radius: 5px;
        text-align: center;
      }
      .footer {
        margin-top: 20px;
        font-size: 14px;
        color: #777777;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Account Deletion Notice</h1>
      </div>
      <div class="content">
        <p>Dear ${userName},</p>
        <p>
          We wanted to let you know that your account has been marked for
          deletion. This means that your account will be permanently deleted in
          3 months from now. During this period, your account will remain
          inactive, and you can still restore it if you change your mind.
        </p>
        <p>
          If you wish to restore your account, please click the button below and
          follow the instructions:
        </p>
        <a href="${restorationLink}" class="button">Restore My Account</a>
        <p>
          If you do not restore your account within the next 3 months, it will
          be permanently deleted and cannot be recovered.
        </p>
        <p>Thank you for being with us.</p>
        <p>Best regards,<br />The Go Digital Team</p>
      </div>
      <div class="footer">
        <p>&copy; ${year} Go Digital. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`;
}
