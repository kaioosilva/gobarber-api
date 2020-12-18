import { injectable, inject } from 'tsyringe';

import User from "@modules/users/infra/typeorm/entities/User";
import iUsersRepository from '@modules/users/repositories/iUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import { classToClass } from 'class-transformer';

interface iRequest {
    user_id: string;
}

@injectable()
class ListProvidersService {
    
    constructor( 
        @inject('UsersRepository')
        private usersRepository: iUsersRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute({ user_id }:iRequest): Promise<User[]> {
        let users = await this.cacheProvider.recover<User[]>(`providers-list:${user_id}`);

        if(!users) {
            users = await this.usersRepository.findAllProviders({
                except_user_id: user_id,
            });

            await this.cacheProvider.save(
                `providers-list:${user_id}`, 
                classToClass(users),
            );
        }

        return users;
    }
}

export default ListProvidersService;