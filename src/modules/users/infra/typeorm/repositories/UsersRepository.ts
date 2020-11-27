
import { getRepository, Repository, Not } from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';
import iUsersRepository from '@modules/users/repositories/iUsersRepository';
import iCreateUserDTO from '@modules/users/dtos/iCreateUserDTO';
import IFindAllProvidersDTO from '@modules/appointments/dtos/IFindAllProvidersDTO';

//SOLID
// LISKOV SUBSTITUTION PRINCIPLE

class UsersRepository implements iUsersRepository {
    private ormRepository: Repository<User>

    constructor() {
        this.ormRepository = getRepository(User);
    }

    public async findById(id: string): Promise<User | undefined> {
        const user = this.ormRepository.findOne(id);

        return user;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const user = this.ormRepository.findOne({
            where: { email },
        });

        return user;
    }

    public async findAllProviders({ except_user_id }: IFindAllProvidersDTO): Promise<User[]> {
        let users: User[];

        if(except_user_id) {
            users = await this.ormRepository.find({
                where: {
                    id: Not(except_user_id)
                }
            })
        } else {
            users = await this.ormRepository.find();
        }

        return users;
    }

    public async create( userData: iCreateUserDTO ): Promise<User> {
        const user = this.ormRepository.create(userData);

        await this.ormRepository.save(user);

        return user;
    }

    public async save(user: User): Promise<User> {
        return this.ormRepository.save(user);
    }
}

export default UsersRepository;