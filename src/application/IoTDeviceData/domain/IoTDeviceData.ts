//IoTDeviceData domain
import IoTDeviceDataId from './value-objects/IoTDeviceDataId';
import IoTDeviceDataKey from './value-objects/IoTDeviceDataKey';
import IoTDeviceDataValue, { IoTDeviceDataType } from './value-objects/IoTDeviceValue';
import IoTDeviceDataDate from './value-objects/IoTDeviceDataDate';
//IoTDevice domain
import IoTDeviceId from '../../IoTDevice/domain/value-objects/IoTDeviceId';
//Shared domain
import { Nullable } from '../../Shared/domain/Nullable';
import AggregateRoot from '../../Shared/domain/AggregateRoot';

/**
 * @author Damián Alanís Ramírez
 * @version 2.3.1
 * @description IoTDeviceData entity abstraction.
 */
export default class IoTDeviceData extends AggregateRoot {
    readonly id: IoTDeviceDataId;
    readonly key: IoTDeviceDataKey;
    readonly value: IoTDeviceDataValue;
    readonly deviceId: IoTDeviceId;
    readonly issuedAt: IoTDeviceDataDate;

    /**
     * Constructor.
     * @param {Nullable<IoTDeviceDataId>} id Device data ID, it can be null, because it can be a mew record, and we need to generate the ID.
     * @param {IoTDeviceDataKey} key Device data key, the parameter it represents.
     * @param {IoTDeviceDataValue} value Device data value.
     * @param {IoTDeviceDataDate} issuedAt Date of creation of the record. 
     */
    constructor(
        id: Nullable<IoTDeviceDataId>,
        key: IoTDeviceDataKey,
        value: IoTDeviceDataValue,
        deviceId: IoTDeviceId,
        issuedAt: Nullable<IoTDeviceDataDate>
    ) {
        super();
        //If no ID is provided, we create a random one
        this.id = id || IoTDeviceDataId.random();
        this.key = key;
        this.value = value;
        this.deviceId = deviceId;
        //If no date is provided, we get the current one
        this.issuedAt = issuedAt || IoTDeviceDataDate.current();
    }

    /**
     * 
     * @param {string} id Device data ID, it can be null, because it can be a mew record, and we need to generate the ID.
     * @param {string} key Device data key, the parameter it represents.
     * @param {IoTDeviceDataType} value Device data value.
     * @param {string} issuedAt Date of creation of the record. 
     * @returns 
     */
    static fromPrimitives = ({
        _id,
        key,
        value,
        deviceId,
        issuedAt
    }: IoTDeviceDataPrimitives) => new IoTDeviceData(
        _id ? new IoTDeviceDataId(_id) : null,
        new IoTDeviceDataKey(key),
        new IoTDeviceDataValue(value),
        new IoTDeviceId(deviceId),
        issuedAt ? new IoTDeviceDataDate(issuedAt) : null
    );

    /**
     * Method to return the instance data in primitive values.
     * @returns Object with the values in primitives.
     */
    toPrimitives = (): IoTDeviceDataPrimitives => ({
        _id: this.id.toString(),
        key: this.key.toString(),
        value: this.value.value,
        deviceId: this.deviceId.toString(),
        issuedAt: this.issuedAt.toString()
    });

    /**
     * Implementation of the abstract method to get the id of the aggregate.
     */
    public get aggregateId(): IoTDeviceId {
        return this.id;
    }
}


export interface IoTDeviceDataParameters {
    id: IoTDeviceDataId;
    key: IoTDeviceDataKey;
    value: IoTDeviceDataValue;
    deviceId: IoTDeviceId;
    issuedAt: IoTDeviceDataDate;
}

export interface IoTDeviceDataPrimitives {
    _id?: string,
    key: string,
    value: IoTDeviceDataType,
    deviceId: string,
    issuedAt?: string,
}