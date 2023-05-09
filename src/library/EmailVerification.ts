import { v4 as uuidv4 } from 'uuid';
import sgMail from '@sendgrid/mail';

function generateVerificationToken(): string {
    return uuidv4();
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

async function sendVerificationEmail(recipient: string, name: string, token: string) {
    const templateId = 'd-02d658756d194d77abfcfb76eb516277';

    const dynamicData = {
        user: name,
        token: process.env.BASE_URL + '/verify-email/' + token,
        unsubscribe: ''
    };

    const msg = {
        to: recipient,
        from: 'gpaonline9@gmail.com',
        templateId,
        dynamic_template_data: dynamicData
    };

    return await sgMail.send(msg);
}

export { generateVerificationToken, sendVerificationEmail };
