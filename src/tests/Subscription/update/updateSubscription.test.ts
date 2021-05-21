//Subscription domain
import Subscription from '../../../application/Subscriptions/domain/Subscription';
import { SubscriptionValidStatus } from '../../../application/Subscriptions/domain/value-objects/SubscriptionStatus';
//Use cases
import CreateSubscription from '../../../application/Subscriptions/application/create/CreateSubscription';
import UpdateSubscription from '../../../application/Subscriptions/application/update/UpdateSubscription';
//Mock repositories
import usersRepository from '../../Shared/infrastructure/User/mockUsersRepository';
import subscriptionRepository from '../../Shared/infrastructure/Subscription/subscriptionMockRepository';
//Mock users
import { primaryUser, secondaryUser } from '../../Shared/domain/User/testUsers';
import { SubscriptionPermissionsParameters } from '../../../application/Subscriptions/domain/value-objects/SubscriptionPermissions';

//Global variables
const updateSubscription: UpdateSubscription = new UpdateSubscription(subscriptionRepository);
let createdSubscription: Subscription;

//We set up the subscriptions
beforeAll(async () => {
    //We create a mock subscription in the repository
    createdSubscription = await new CreateSubscription(usersRepository, subscriptionRepository).run({
        to: primaryUser.id.toString(),
        from: secondaryUser.id.toString()
    });
});

//We test the subscription status update
it('A subscription with PENDING status is updated to ACCEPTED successfully', async () => {
    const updatedSubscription = await updateSubscription.updateStatusAndPermissions({
        id: createdSubscription.id.toString(),
        status: SubscriptionValidStatus.ACCEPTED
    });
    expect(updatedSubscription).toBeDefined();
    expect(updatedSubscription.toPrimitives()).toHaveProperty('status', SubscriptionValidStatus.ACCEPTED);
});

//We test the subscription permissions update
it('Subscription permissions are updated successfully', async () => {
    const mockPermissions: SubscriptionPermissionsParameters = {
        readOwnerData: true, 
        readChatMessages: false,
        sendChatMessages: false,
        receiveNotificationsOnOwnerEvents: true
    };
    const updatedSubscription = await updateSubscription.updateStatusAndPermissions({
        id: createdSubscription.id.toString(),
        status: SubscriptionValidStatus.ACCEPTED,
        permissions: mockPermissions
    });
    expect(updatedSubscription).toBeDefined();
    expect(updatedSubscription.toPrimitives().permissions).toMatchObject(mockPermissions);
});