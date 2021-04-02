import EnumValueObject from '../value-object/EnumValueObject';
import InvalidArgumentError from '../exceptions/InvalidArgumentError';

export enum OrderTypes {
    ASC = 'asc',
    DESC = 'desc',
    NONE = 'none'
}

/**
 * @author Damián Alanís Ramírez
 * @version 0.1.1
 * @description Class that represents an order type, ie: ASC, to order criteria.
 */
export default class OrderType extends EnumValueObject<OrderTypes> {
    constructor(value: OrderTypes) {
        super(value, Object.values(OrderTypes));
    }

    static fromValue(value: string): OrderType {
        switch (value) {
            case OrderTypes.ASC:
                return new OrderType(OrderTypes.ASC);
            case OrderTypes.DESC:
                return new OrderType(OrderTypes.DESC);
            default:
                throw new InvalidArgumentError(`The order type ${value} is invalid`);
        }
    }

    public isNone(): boolean {
        return this.value === OrderTypes.NONE;
    }

    public isAsc(): boolean {
        return this.value === OrderTypes.ASC;
    }

    protected throwErrorForInvalidValue(value: OrderTypes): void {
        throw new InvalidArgumentError(`The order type ${value} is invalid`);
    }
}
