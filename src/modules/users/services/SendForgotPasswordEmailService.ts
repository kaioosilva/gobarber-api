import { injectable, inject } from 'tsyringe';
import path from 'path';

import iUsersRepository from '@modules/users/repositories/iUsersRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import AppError from '@shared/errors/AppError';

interface iRequest {
    email: string;
}

@injectable()
class SendForgotPasswordEmailService {

    constructor( 
        @inject('UsersRepository')
        private usersRepository: iUsersRepository,

        @inject('MailProvider')
        private mailProvider: IMailProvider,

        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository,
    ) {}
    public async execute({ email }: iRequest): Promise<void> {
        const user = await this.usersRepository.findByEmail(email);

        if(!user) {
            throw new AppError('User does not exist');
        }

        const { token } = await this.userTokensRepository.generate(user.id);

        const forgotPasswordTemplate = path.resolve(__dirname, '..', 'views', 'forgot_password.hbs');

        await this.mailProvider.sendEmail({
            to: {
                name: user.name,
                email: user.email,
            },
            subject: '[GoBarber] Password recovery',
            templateData: {
                file: forgotPasswordTemplate,
                variables: {
                    name: user.name,
                    link: `${process.env.APP_WEB_URL}/reset-password?token=${token}`,
                }
            }
        });
    }
    
}

export default SendForgotPasswordEmailService;