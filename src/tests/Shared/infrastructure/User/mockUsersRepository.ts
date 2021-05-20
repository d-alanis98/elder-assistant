//User domain
import User, { UserPrimitives } from '../../../../application/User/domain/User';
import UserId from '../../../../application/Shared/domain/modules/User/UserId';
//Repository contract
import UserRepository from '../../../../application/User/domain/UserRepository';
//Mock repository
import InMemoryRepository from '../Persistence/InMemoryRepository';
//Mock users
import { adminUser, primaryUser, secondaryUser } from '../../domain/User/testUsers';
import { Nullable } from '../../../../application/Shared/domain/Nullable';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Mock user repository implementing in-memory data storage.
 */
export class UsersMockRepository  {
    public memoryRepository: InMemoryRepository<User>;

    constructor() {
        this.memoryRepository = new InMemoryRepository<User>();
    }

    search = async (id: string | UserId): Promise<Nullable<User>> => {
        const document: UserPrimitives | undefined = await this.memoryRepository.search(id.toString());
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

const mockUsersRepository: UserRepository = new UsersMockRepository();
mockUsersRepository.create(primaryUser);
mockUsersRepository.create(secondaryUser);
mockUsersRepository.create(adminUser);

export default mockUsersRepository;
