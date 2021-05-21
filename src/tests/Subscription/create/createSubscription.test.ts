//Subscription domain
import Subscription from '../../../application/Subscriptions/domain/Subscription';
//Domain exceptions
import CircularSubscriptionNotAllowed from '../../../application/Subscriptions/domain/exceptions/CircularSubscriptionNotAllowed';
import SubscriptionTargetIsNotAPrimaryUser from '../../../application/Subscriptions/domain/exceptions/SubscriptionTargetIsNotAPrimaryUser';
//Use case
import CreateSubscription from '../../../application/Subscriptions/application/create/CreateSubscription';
//Mock repositories
import usersRepository from '../../Shared/infrastructure/User/mockUsersRepository';
import subscriptionRepository from '../../Shared/infrastructure/Subscription/subscriptionMockRepository';
//Mock users
import { adminUser, primaryUser, secondaryUser } from '../../Shared/domain/User/testUsers';


//Use case
const createSubscription: CreateSubscription = new CreateSubscription(usersRepository, subscriptionRepository);

//We test the subscription creation by the use case
it('Subscription is created successfully', async () => {
    const createdSubscription: Subscription = await createSubscription.run({
        to: primaryUser.id.toString(),
        from: secondaryUser.id.toString()
    });
    expect(createdSubscription).toBeDefined();
    expect(createdSubscription.toPrimitives()).toHaveProperty('_id');
});

//We test the user type subscription validation (subscription to a user that is not a primary user is not allowed)
it('Subscription to a user that is not a primary user is not allowed', async () => {
    try {
        await createSubscription.run({
            to: adminUser.id.toString(),
            from: secondaryUser.id.toString()
        });
    } catch(error) {
        expect(error).toBeInstanceOf(SubscriptionTargetIsNotAPrimaryUser)
    }
});

//We test the circular subscription validation (subscription of a user to himself)
it('Subscription of a user to himself is not allowed', async () => {
    try {
        await createSubscription.run({
            to: primaryUser.id.toString(),
            from: primaryUser.id.toString()
        });
    } catch(error) {
        expect(error).toBeInstanceOf(CircularSubscriptionNotAllowed)
    }
});