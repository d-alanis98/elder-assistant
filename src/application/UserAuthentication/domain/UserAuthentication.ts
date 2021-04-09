//Domain value objects
import UserId from '../../Shared/domain/modules/User/UserId';
import UserAuthenticationDate from './value-objects/UserAuthenticationDate';
import UserAuthenticationToken from './value-objects/UserAuthenticationToken';
import UserAuthenticationAgent from './value-objects/UserAuthenticationAgent';
//Shared domain
import AggregateRoot from '../../Shared/domain/AggregateRoot';

/**
 * @author Damian Alanis Ramirez
 * @version 3.4.6
 * @description User authentication unit abstraction.
 */
export default class UserAuthentication extends AggregateRoot {
    readonly id: UserId;
    readonly agent: UserAuthenticationAgent;
    readonly refreshToken: UserAuthenticationToken;
    readonly issuedAtDate: UserAuthenticationDate;

    constructor(
        id: UserId, 
        agent: UserAuthenticationAgent,
        refreshToken: UserAuthenticationToken,
        issuedAtDate?: UserAuthenticationDate
    ) {
        super();
        this.id = id;
        this.agent = agent;
        this.refreshToken = refreshToken;
        this.issuedAtDate = issuedAtDate || new UserAuthenticationDate(new Date());
    }

    //Facade
    /**
     * Facade method to create a user authentication instance without using new operator.
     * @param {UserId} id User id.
     * @param {UserAuthenticationToken} token JWT refresh token. 
     * @returns 
     */
    static create = ({
        id,
        agent,
        token,
        issuedAt
    }: UserAuthenticationParameters) => new UserAuthentication(
        id,
        agent,
        token,
        issuedAt
    );

    /**
     * Method to create a user authentication instance from primitive values.
     * @param {string} _id User id string.
     * @param {string} token User token string.
     * @returns 
     */
    static fromPrimitives = ({
        agent: { deviceName, deviceType },
        token,
        userId,
        issuedAt,
    }: UserAuthenticationPrimitives ) => new UserAuthentication(
        new UserId(userId),
        new UserAuthenticationAgent(deviceName, deviceType),
        new UserAuthenticationToken(token),
        new UserAuthenticationDate(issuedAt),
    );

    /**
     * Returns a primitive value object representation of the instance.
     * @returns {Object} Primitive values object.
     */
    toPrimitives = (): UserAuthenticationPrimitives => ({
        agent: this.agent.toPrimitives(),
        token: this.refreshToken.toString(),
        userId: this.id.toString(),
        issuedAt: this.issuedAtDate.toString(),
    });

    /**
     * Implementation of the abstract method to get the id of the aggregate.
     */
    public get aggregateId(): UserId {
        return this.id;
    }
}

export interface UserAuthenticationParameters {
    id: UserId;
    agent: UserAuthenticationAgent;
    token: UserAuthenticationToken;
    issuedAt?: UserAuthenticationDate;
}


export interface UserAuthenticationPrimitives {
    agent: AuthenticationDeviceAgent;
    token: string;
    userId: string;
    issuedAt: string;
}

export interface AuthenticationDeviceAgent {
    deviceName: string;
    deviceType: string;
};