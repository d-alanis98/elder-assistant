//Domain
import Subscription from '../../../../application/Subscriptions/domain/Subscription';
//Repository contract
import SubscriptionRepository from '../../../../application/Subscriptions/domain/SubscriptionsRepository';
//Mock repository implementation
import InMemoryRepository from '../Persistence/InMemoryRepository';


const subscriptionRepository: SubscriptionRepository = new InMemoryRepository<Subscription>();

export default subscriptionRepository;