//Subscription domain
import Subscription from '../../../application/Subscriptions/domain/Subscription';
//Domain exceptions
import SubscriptionNotFound from '../../../application/Subscriptions/domain/exceptions/SubscriptionNotFound';
//Use cases
import FindSubscription from '../../../application/Subscriptions/application/find/FindSubscription';
import CreateSubscription from '../../../application/Subscriptions/application/create/CreateSubscription';
//Shared domain
import Uuid from '../../../application/Shared/domain/value-object/Uuid';
//Mock repositories
import usersRepository from '../../Shared/infrastructure/User/mockUsersRepository';
import subscriptionRepository from '../../Shared/infrastructure/Subscription/subscriptionMockRepository';
//Mock users
import { primaryUser, secondaryUser } from '../../Shared/domain/User/testUsers';

//Global variables
const findSubscription: FindSubscription = new FindSubscription(subscriptionRepository);
let createdSubscription: Subscription;

//We set up the subscriptions
beforeAll(async () => {
    //We create a mock subscription in the repository
    createdSubscription = await new CreateSubscription(usersRepository, subscriptionRepository).run({
        to: primaryUser.id.toString(),
        from: secondaryUser.id.toString()
    });
})

//We test the search by members operation
it('Subscription is found by members (to and from)', async () => {
    const foundSubscription = await findSubscription.run({
        to: primaryUser.id.toString(),
        from: secondaryUser.id.toString()
    });
    expect(foundSubscription).toBeDefined();
    expect(foundSubscription).toHaveProperty('_id');
});

//We test the search by subscription ID operation
it('Subscription is found by subscription ID', async () => {
    const foundSubscription = await findSubscription.searchById(createdSubscription.id.toString());
    expect(foundSubscription).toBeDefined();
    expect(foundSubscription).toHaveProperty('_id');
});

//We test the search operation for requests made by an applicant identified by it's user ID
it('Made subscription requests are retrieved by applicant ID', async () => {
    const foundSubscription = await findSubscription.getMadeRequests(
        secondaryUser.id.toString(),
        { status: 'PENDING' }
    )
    expect(foundSubscription).toBeDefined();
    expect(foundSubscription).toContainEqual(createdSubscription.toPrimitives())
});

//We test the search operation for requests made to a target user (primary user) identified by it's user ID
it('Made subscription requests are retrieved by target user ID', async () => {
    const foundSubscription = await findSubscription.getReceivedRequests(
        primaryUser.id.toString(),
        { status: 'PENDING' }
    )
    expect(foundSubscription).toBeDefined();
    expect(foundSubscription).toContainEqual(createdSubscription.toPrimitives())
});

//We test the NotFound exception that must be thrown when a subscription does not exist
it('When a subscription is not found by ID an exception is thrown', async () => {
    try {
        const mockSubscriptionId = Uuid.random().toString();
        await findSubscription.searchById(mockSubscriptionId);
    } catch(exception) {
        expect(exception).toBeInstanceOf(SubscriptionNotFound);
    }
});