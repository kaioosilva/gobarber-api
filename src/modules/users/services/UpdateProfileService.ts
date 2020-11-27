import { injectable, inject } from 'tsyringe';

import User from "@modules/users/infra/typeorm/entities/User";
import IHashProvider from '@modules/users/providers/HashProvider/models/iHashProvider';
import iUsersRepository from '@modules/users/repositories/iUsersRepository';
import AppError from '@shared/errors/AppError';
import { id } from 'date-fns/locale';

interface iRequest {
    user_id: string;
    name: string;
    email: string;
    old_password?: string;
    password?: string;
}

@injectable()
class UpdateProfileService {
    
    constructor( 
        @inject('UsersRepository')
        private usersRepository: iUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ user_id, name, email, password, old_password }:iRequest): Promise<User> {
        const user = await this.usersRepository.findById(user_id);

        if(!user) {
            throw new AppError('User not found.');
        }

        const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

        if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
            throw new AppError('Email already in use.');
        }

        if(password && !old_password) {
            throw new AppError('You need to inform the old password to set a new passord.');
        }

        if(password && old_password) {
            const checkPassword = await this.hashProvider.compareHash(
                old_password,
                user.password,
            );

            if(!checkPassword) {
                throw new AppError('Old password does not match.')
            }

            user.password = await this.hashProvider.generateHash(password);
        }

        user.name = name;
        user.email = email;

        return this.usersRepository.save(user);
    }
}

export default UpdateProfileService;