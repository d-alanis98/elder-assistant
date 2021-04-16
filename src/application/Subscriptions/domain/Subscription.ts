//Subscription domain
import SubscriptionId from './value-objects/SubscriptionId';
import SubscriptionStatus from './value-objects/SubscriptionStatus';
import SubscriptionPermissions, { SubscriptionPermissionsParameters } from './value-objects/SubscriptionPermissions';
//User domain
import UserId from '../../Shared/domain/modules/User/UserId';
//Shared domain
import { Nullable } from '../../Shared/domain/Nullable';
import AggregateRoot from '../../Shared/domain/AggregateRoot';



/**
 * @author Damián Alanís Ramírez
 * @version 2.4.1
 * @description Subscription entity.
 */
export default class Subscription extends AggregateRoot {
    readonly id: SubscriptionId;
    readonly to: UserId;
    readonly from: UserId;
    readonly status: SubscriptionStatus;
    readonly permissions?: SubscriptionPermissions;

    constructor(
        id: Nullable<SubscriptionId>,
        to: UserId,
        from: UserId,
        status?: SubscriptionStatus,
        permissions?: SubscriptionPermissions
    ) {
        super();
        this.id = id ||  SubscriptionId.random();
        this.to = to;
        this.from = from;
        //If no status is provided, we default it to pending
        this.status = status || SubscriptionStatus.withPendingStatus();
        this.permissions = permissions;
    }

    //Facade
    /**
     * Method to get a Subscription instance from primitive values.
     * @param {string} _id Id of the subscription.
     * @param {string} to Id of the user that receives the subscription.
     * @param {string} from Id of the user that is subscribing.
     * @param {SubscriptionPermissionsParameters} permissions Object with the permissions of the subscription.
     * @returns 
     */
    static fromPrimitives = ({
        _id,
        to,
        from,
        status,
        permissions
    }: SubscriptionPrimitives) => new Subscription(
        new SubscriptionId(_id),
        new UserId(to),
        new UserId(from),
        status ? new SubscriptionStatus(status) : undefined,
        permissions && new SubscriptionPermissions(permissions)
    );

    /**
     * Method to return the instance data in primitive values.
     * @returns Object with the values in primitives.
     */
    toPrimitives = (): SubscriptionPrimitives => ({
        _id: this.id.toString(),
        to: this.to.toString(),
        from: this.from.toString(),
        status: this.status.value,
        permissions: this.permissions?.value()
    })

    /**
     * Implementation of the abstract method to get the id of the aggregate.
     */
    public get aggregateId() {
        return this.id;
    }
}

export interface SubscriptionPrimitives extends SubscriptionRequestPrimitives {
    _id: string;
}

export interface SubscriptionRequestPrimitives {
    to: string;
    from: string;
    status?: string;
    permissions?: SubscriptionPermissionsParameters;
}