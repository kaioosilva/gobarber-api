import { injectable, inject } from 'tsyringe';

import User from "@modules/users/infra/typeorm/entities/User";
import iUsersRepository from '@modules/users/repositories/iUsersRepository';
import AppError from '@shared/errors/AppError';

interface iRequest {
    user_id: string;
}

@injectable()
class ShowProfileService {
    
    constructor( 
        @inject('UsersRepository')
        private usersRepository: iUsersRepository,
    ) {}

    public async execute({ user_id }:iRequest): Promise<User> {
        const user = await this.usersRepository.findById(user_id);

        if(!user) {
            throw new AppError('User not found.');
        }

        return user;
    }
}

export default ShowProfileService;