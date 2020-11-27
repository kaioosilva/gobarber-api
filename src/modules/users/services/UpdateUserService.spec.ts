import AppError from '@shared/errors/AppError';

import FakeUserRepository from '@modules/users/repositories/fakes/fakeUsersRepository';
import FakeStorageRepository from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';

import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUserRepository: FakeUserRepository;
let fakeStorageRepository: FakeStorageRepository;
let updateUserAvatar: UpdateUserAvatarService;

describe('updateUserAvatar', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeStorageRepository = new FakeStorageRepository();
        updateUserAvatar = new UpdateUserAvatarService(fakeUserRepository, fakeStorageRepository);
    });

    it('should be able to upload a new Avatar', async () => {
        const user = await fakeUserRepository.create({
            name: 'John doe',
            email: 'johndoe@gmail.com',
            password: '123456',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.png',
        });

        expect(user.avatar).toEqual('avatar.png');
    });

    it('should not be able to upload an avatar from non existing user', async () => {
        await expect(updateUserAvatar.execute({
            user_id: 'non-existing user',
            avatarFilename: 'avatar.png',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should delete old avatar when uploading new one', async () => {
        //Ira espionar a funcao deleteFile, pra saber se ela foi chamada.
        const deleteFile = jest.spyOn(fakeStorageRepository, 'deleteFile');

        const user = await fakeUserRepository.create({
            name: 'John doe',
            email: 'johndoe@gmail.com',
            password: '123456',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar2.jpg',
        });

        expect(deleteFile).toBeCalledWith('avatar.jpg');
        expect(user.avatar).toEqual('avatar2.jpg');
    })
})