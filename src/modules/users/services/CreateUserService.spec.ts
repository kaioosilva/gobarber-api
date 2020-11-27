import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/fakeUsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;

describe('createUsers', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        createUserService = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    });
    
    it('should be able to create a new user', async () => {
        const user = await createUserService.execute({
            name: 'John Doe',
            email: 'johndow@gmail.com',
            password: '123456'
        });

        return user;
    });

    it('should not be able to create a new user with same email address from another', async () => {
        await createUserService.execute({
            name: 'John Doe',
            email: 'johndow@gmail.com',
            password: '123456' 
        });

        await expect(createUserService.execute({
            name: 'John Doe',
            email: 'johndow@gmail.com',
            password: '123456' 
        })).rejects.toBeInstanceOf(AppError);
    })
})