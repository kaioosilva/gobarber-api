import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IHashProvider from '@modules/users/providers/HashProvider/models/iHashProvider';
import User from '@modules/users/infra/typeorm/entities/User';
import iUsersRepository from '@modules/users/repositories/iUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface iRequest {
    name: string;
    email: string;
    password: string;
}

@injectable()
class CreateUserService {

    constructor( 
        @inject('UsersRepository')
        private usersRepository: iUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}
    public async execute({ name, email, password }: iRequest): Promise<User> {

        const checkUserExists = await this.usersRepository.findByEmail(email);

        if(checkUserExists) {
            throw new AppError('Email address already used.');
        }

        const hashedPassword = await this.hashProvider.generateHash(password);

        const user = await this.usersRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        await this.cacheProvider.invalidatePrefix('providers-list');

        return user;
    }
    
}

export default CreateUserService;