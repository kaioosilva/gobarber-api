import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IHashProvider from '@modules/users/providers/HashProvider/models/iHashProvider';
import User from '@modules/users/infra/typeorm/entities/User';
import iUsersRepository from '@modules/users/repositories/iUsersRepository';

interface iRequest {
    email: string,
    password: string;
}

interface iResponse { 
    user: User;
    token: string;
}

@injectable()
class AuthenticateUserService {

    constructor( 
        @inject('UsersRepository')
        private userRepository: iUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ email, password }: iRequest): Promise<iResponse> {

        const user = await this.userRepository.findByEmail(email);

        if(!user){
            throw new AppError('Incorrect email/password combination.', 401);
        }

        /** Metodo compare - Ele compara um password string, com um password com hash */
        const passwordMatched = await this.hashProvider.compareHash(password, user.password);

        if(!passwordMatched) {
            throw new AppError('Incorrect email/password combination.', 401);
        }

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        })

        return {
            user,
            token
        }
    }
}

export default AuthenticateUserService;