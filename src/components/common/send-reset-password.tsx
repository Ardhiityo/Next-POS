import { transporter } from "@/lib/nodemailer";
import { ResetPasswordEmail } from "./reset-password-mail";
import { render } from 'react-email';

type SendMailProps = {
    from: string
    to: string
    subject: string
    url: string,
    username: string
}

const SendResetPassword = async ({ from, to, subject, url, username }: SendMailProps) => {
    await transporter.sendMail({
        from,
        to,
        subject,
        html: await render(<ResetPasswordEmail url={url} username={username} />)
    });
}

export default SendResetPassword