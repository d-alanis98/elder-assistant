//IoTDevice domain
import IoTDeviceId from './value-objects/IoTDeviceId';
import IoTDeviceName from './value-objects/IoTDeviceName';
import IoTDeviceType from './value-objects/IoTDeviceType';
import IoTDeviceEventKeys from './value-objects/IoTDeviceEventKeys';
import IoTDeviceConfiguration from './value-objects/IoTDeviceConfiguration';
//Shared domain
import UserId from '../../Shared/domain/modules/User/UserId';
import AggregateRoot from '../../Shared/domain/AggregateRoot';


/**
 * @author Damián Alanís Ramírez
 * @version 3.6.3
 * @description IoTDevice entity abstraction.
 */
export default class IoTDevice extends AggregateRoot {
    readonly id: IoTDeviceId;
    readonly name: IoTDeviceName;
    readonly type: IoTDeviceType;
    readonly ownedBy?: UserId;
    readonly eventkeys: IoTDeviceEventKeys;
    readonly configuration?: IoTDeviceConfiguration;


    constructor(
        id: IoTDeviceId,
        name: IoTDeviceName,
        type: IoTDeviceType,
        ownedBy?: UserId,
        eventKeys?: IoTDeviceEventKeys,
        configuration?: IoTDeviceConfiguration
    ) {
        super();
        this.id = id;
        this.name = name;
        this.type = type;
        this.ownedBy = ownedBy;
        this.eventkeys = eventKeys || new IoTDeviceEventKeys([]);
        this.configuration = configuration;
    }

    /**
     * Method that returns an object with the primitive values of the instance data.
     * @returns {Object} Object with primitives.
     */
    public toPrimitives = (): IoTDevicePrimitives => {
        let primitiveValues: IoTDevicePrimitives = {
            _id: this.id.toString(),
            name: this.name.toString(),
            type: this.type.value,
            eventKeys: this.eventkeys.values,
        }
        if(this.ownedBy)
            primitiveValues.ownedBy = this.ownedBy.toString();
        if (this.configuration)
            primitiveValues.configuration = this.configuration;
        return primitiveValues;
    }

    //Facade
    /**
     * Facade method to create a new IoTDevice, without making use of the new operator.
     * @param id IoT device id.
     * @param name IoT device name.
     * @param type IoT device type.
     * @param ownedBy IoT device owner.
     * @param configuration IoT device configuration.
     * @returns {IoTDevice} A new IoTDevice instance.
     */
    static create = (
        id: IoTDeviceId,
        name: IoTDeviceName,
        type: IoTDeviceType,
        ownedBy?: UserId,
        eventKeys?: IoTDeviceEventKeys,
        configuration?: IoTDeviceConfiguration
    ): IoTDevice => new IoTDevice(
        id,
        name,
        type,
        ownedBy,
        eventKeys,
        configuration
    );

    /**
     * Facade method to create a new IoTDevice instance from primitive values.
     * @param {IoTDevicePrimitives} IoT device data in primitive values. 
     * @returns 
     */
    static fromPrimitives = ({
        _id,
        name,
        type,
        ownedBy,
        eventKeys,
        configuration
    }: IoTDevicePrimitives) => new IoTDevice(
        new IoTDeviceId(_id),
        new IoTDeviceName(name),
        new IoTDeviceType(type),
        ownedBy ? new UserId(ownedBy) : undefined,
        new IoTDeviceEventKeys(eventKeys),
        configuration && new IoTDeviceConfiguration(configuration)
    );

    /**
     * Implementation of the abstract method to get the id of the aggregate.
     */
    public get aggregateId(): IoTDeviceId {
        return this.id;
    }
}

//Types
export interface IoTDeviceParameters {
    id: IoTDeviceId;
    name: IoTDeviceName;
    type: IoTDeviceType;
    ownedBy?: UserId;
    configuration?: IoTDeviceConfiguration;
};

export interface IoTDevicePrimitives {
    _id: string;
    name: string;
    type: string;
    ownedBy?: string;
    eventKeys: string[];
    configuration?: Object;
};

export interface NewIoTDevicePrimitives {
    name: string;
    type: string;
    eventKeys?: string[];
}