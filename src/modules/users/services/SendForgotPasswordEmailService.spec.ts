
import FakeUserRepository from '@modules/users/repositories/fakes/fakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import AppError from '@shared/errors/AppError';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUserRepository: FakeUserRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokensRepository = new FakeUserTokensRepository();

        sendForgotPasswordEmailService = new SendForgotPasswordEmailService(fakeUserRepository, fakeMailProvider, fakeUserTokensRepository);
    })

    it('should be able to recover password informing the email', async () => {
        
        const sendEmail = jest.spyOn(fakeMailProvider, 'sendEmail');

        await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456',
        });

        await sendForgotPasswordEmailService.execute({
            email: 'johndoe@gmail.com'
        });

        expect(sendEmail).toHaveBeenCalled()
    });

    it('should not be able to recover a non-existing user password', async () => {

        await expect(sendForgotPasswordEmailService.execute({
            email: 'johndoe@gmail.com',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to generate a forgot password token', async () => {
        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456',
        });

        await sendForgotPasswordEmailService.execute({
            email: 'johndoe@gmail.com'
        });

        expect(generateToken).toHaveBeenCalledWith(user.id);
    })
})