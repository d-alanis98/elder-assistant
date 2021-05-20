//User domain
import User, { UserPrimitives } from '../../../../application/User/domain/User';
import UserId from '../../../../application/Shared/domain/modules/User/UserId';
//Repository contract
import UserRepository from '../../../../application/User/domain/UserRepository';
//Mock repository
import InMemoryRepository from '../../infrastructure/persistence/InMemoryRepository';
//Mock users
import { adminUser, primaryUser, secondaryUser } from './testUsers';
import { Nullable } from '../../../../application/Shared/domain/Nullable';



class UsersRepository  {
    private memoryRepository: InMemoryRepository<User>;

    constructor() {
        this.memoryRepository = new InMemoryRepository<User>();
        this.memoryRepository.create(primaryUser);
        this.memoryRepository.create(secondaryUser);
        this.memoryRepository.create(adminUser);
    }

    search = async (id: string | UserId): Promise<Nullable<User>> => {
        const document: UserPrimitives | undefined = await this.memoryRepository.search(id);
        return document
            ? User.fromPrimitives(document)
            : undefined;
    }

    create = async (user: User) => {
        return await this.memoryRepository.create(user);
    }

    update = async (user: User) => {
        return await this.memoryRepository.update(user);
    }

    delete = async (id: string | UserId) => {
        await this.memoryRepository.delete(id);
    }
}

const mockUsersRepository: UserRepository = new UsersRepository();

export default mockUsersRepository;
