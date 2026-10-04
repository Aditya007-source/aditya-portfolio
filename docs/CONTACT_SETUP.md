# Contact email notifications

The contact form submits the visitor's name, reply email, and message to FormSubmit, addressed to `adityamishra3917@gmail.com`. It works on static hosting and without JavaScript. There are no API keys, Gmail passwords, or backend dependencies in the portfolio.

## Activate before sharing the hosted site

1. Build and host the portfolio normally (`npm run build`, publish `dist/`).
2. On the hosted site, fill in the contact form using your own details and click **Send message**.
3. Complete the verification on FormSubmit's page.
4. Open the activation email sent to `adityamishra3917@gmail.com` and confirm the form. Check spam if necessary.
5. Submit a second test message from the hosted site. Confirm that its name, email, and message arrive in your inbox, and that Reply addresses the visitor.

The first submission initiates activation; do not rely on it as a delivered contact message. Real mailbox delivery and activation have not been tested by the development checks.

## Visitor experience

The form requires a name, valid email, and message. Submission navigates to FormSubmit for its verification and confirmation. The provider's default reCAPTCHA remains enabled, and an additional hidden honeypot field filters automated submissions. No local text file is downloaded. The direct email link remains available as an alternative.

FormSubmit processes the submitted information. The form says this before submission. Its endpoint is a public form address, not a secret credential. FormSubmit can supply a random endpoint identifier after email confirmation; that can replace the email in the action if desired.

## Maintenance

The form is in `src/components/Contact.tsx`; its recipient comes from `profile.email` in `src/data.ts`. Changing the recipient requires activating the new email. Changing source files requires rebuilding and redeploying.

Automated tests inspect the submission contract and required email validation. The browser test intercepts the external request; it does not send real email. No Gmail account access is necessary.

Google Sheets is not configured. If spreadsheet storage is preferred later, provide the target spreadsheet and use an authenticated integration or an Apps Script endpoint that writes to it and sends notifications.

Reference: [FormSubmit setup and activation](https://formsubmit.co/) and [fields and spam protection](https://formsubmit.co/documentation).
