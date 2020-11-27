import AppError from '@shared/errors/AppError';

import FakeUserRepository from '@modules/users/repositories/fakes/fakeUsersRepository';

import ShowProfileService from './ShowProfileService';

let fakeUserRepository: FakeUserRepository;
let showProfileService: ShowProfileService;

describe('updateUserAvatar', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        showProfileService = new ShowProfileService(fakeUserRepository);
    });

    it('should be able to show the profile', async () => {
        const user = await fakeUserRepository.create({
            name: 'John doe',
            email: 'johndoe@gmail.com',
            password: '123456',
        });

        const profile = await showProfileService.execute({
            user_id: user.id,
        });

        expect(profile.name).toEqual('John doe');
        expect(profile.email).toEqual('johndoe@gmail.com');
    });

    it('should not be able to show the profile from non-existing user', async () => {
        await expect(showProfileService.execute({
            user_id: 'non-existing-user-id',
        })).rejects.toBeInstanceOf(AppError);
    });
})