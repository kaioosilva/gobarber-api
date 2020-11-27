import { uuid } from 'uuidv4';
import User from '@modules/users/infra/typeorm/entities/User';
import iUsersRepository from '@modules/users/repositories/iUsersRepository';
import iCreateUserDTO from '@modules/users/dtos/iCreateUserDTO';
import IFindAllProvidersDTO from '@modules/appointments/dtos/IFindAllProvidersDTO';

//SOLID
// LISKOV SUBSTITUTION PRINCIPLE

class FakeUsersRepository implements iUsersRepository {
    private users: User[] = [];

    public async findById(id: string): Promise<User | undefined> {

        const findUser = this.users.find(user => user.id === id);

        return findUser;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const findUser = this.users.find(user => user.email === email);
        return findUser;
    }

    public async findAllProviders({ except_user_id }: IFindAllProvidersDTO): Promise<User[]> {
        let { users } = this;

        if(except_user_id) {
            users = this.users.filter(user => user.id !== except_user_id);
        }

        return users;
    }

    public async create( userData: iCreateUserDTO ): Promise<User> {
        const newUser = new User();

        Object.assign(newUser, { id: uuid() }, userData);

        this.users.push(newUser);

        return newUser;
    }

    public async save(user: User): Promise<User> {
        const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

        this.users[findIndex] = user;

        return user;
    }
}

export default FakeUsersRepository;