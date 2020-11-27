import AppError from '@shared/errors/AppError';

import FakeUserRepository from '@modules/users/repositories/fakes/fakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import UpdateProfileService from './UpdateProfileService';

let fakeUserRepository: FakeUserRepository;
let fakeHashRepository: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('updateProfile', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeHashRepository = new FakeHashProvider();
        updateProfile = new UpdateProfileService(fakeUserRepository, fakeHashRepository);
    });

    it('should be able to update the profile', async () => {
        const user = await fakeUserRepository.create({
            name: 'John doe',
            email: 'johndoe@gmail.com',
            password: '123456',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'John Trê',
            email: 'johntre@gmail.com'
        });

        expect(updatedUser.name).toBe('John Trê');
        expect(updatedUser.email).toBe('johntre@gmail.com');

    });

    it('should not be able to update the profile from non-existing user', async () => {
        await expect(updateProfile.execute({
            user_id: 'non-existing-user-id',
            name: 'John doe',
            email: 'johndoe@gmail.com',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to change the email address to another existing email address', async () => {
        fakeUserRepository.create({
            name: 'John doe',
            email: 'johndoe@gmail.com',
            password: '123456',
        });

        const user = await fakeUserRepository.create({
            name: 'Test',
            email: 'test@gmail.com',
            password: '123456',
        });

        await expect(updateProfile.execute({
            user_id: user.id,
            name: 'John doe',
            email: 'johndoe@gmail.com'
        })).rejects.toBeInstanceOf(AppError);

    });

    it('should be able to update the password', async () => {

        const user = await fakeUserRepository.create({
            name: 'Test',
            email: 'test@gmail.com',
            password: '123456',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'John doe',
            email: 'johndoe@gmail.com',
            old_password: '123456',
            password: '123123'
        })

        expect(updatedUser.password).toBe('123123');

    });

    it('should not be able to update the password without old password', async () => {

        const user = await fakeUserRepository.create({
            name: 'Test',
            email: 'test@gmail.com',
            password: '123456',
        });

        await expect(updateProfile.execute({
            user_id: user.id,
            name: 'John doe',
            email: 'johndoe@gmail.com',
            password: '123123'
        })).rejects.toBeInstanceOf(AppError);

    });

    it('should not be able to update the password with wrong old password', async () => {

        const user = await fakeUserRepository.create({
            name: 'Test',
            email: 'test@gmail.com',
            password: '123456',
        });
        
        await expect(updateProfile.execute({
            user_id: user.id,
            name: 'John doe',
            email: 'johndoe@gmail.com',
            old_password: 'wrong-old-password',
            password: '123123'
        })).rejects.toBeInstanceOf(AppError);

    });
})