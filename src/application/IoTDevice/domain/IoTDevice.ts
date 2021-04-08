//IoTDevice domain
import IoTDeviceId from './value-objects/IoTDeviceId';
import IoTDeviceName from './value-objects/IoTDeviceName';
import IoTDeviceType from './value-objects/IoTDeviceType';
import IoTDeviceConfiguration from './value-objects/IoTDeviceConfiguration';
//Shared domain
import UserId from '../../Shared/domain/modules/User/UserId';
import AggregateRoot from '../../Shared/domain/AggregateRoot';


/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description IoTDevice entity abstraction.
 */
export default class IoTDevice extends AggregateRoot {
    readonly id: IoTDeviceId;
    readonly name: IoTDeviceName;
    readonly type: IoTDeviceType;
    readonly ownedBy: UserId;
    readonly configuration?: IoTDeviceConfiguration;


    constructor(
        id: IoTDeviceId,
        name: IoTDeviceName,
        type: IoTDeviceType,
        ownedBy: UserId,
        configuration?: IoTDeviceConfiguration
    ) {
        super();
        this.id = id;
        this.name = name;
        this.type = type;
        this.ownedBy = ownedBy;
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
            ownedBy: this.ownedBy.toString(),
        }
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
        ownedBy: UserId,
        configuration?: IoTDeviceConfiguration
    ): IoTDevice => new IoTDevice(
        id,
        name,
        type,
        ownedBy,
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
        configuration
    }: IoTDevicePrimitives) => new IoTDevice(
        new IoTDeviceId(_id),
        new IoTDeviceName(name),
        new IoTDeviceType(type),
        new UserId(ownedBy),
        configuration && new IoTDeviceConfiguration(configuration)
    );
}

//Types
export interface IoTDeviceParameters {
    id: IoTDeviceId;
    name: IoTDeviceName;
    type: IoTDeviceType;
    ownedBy: UserId;
    configuration?: IoTDeviceConfiguration;
};

export interface IoTDevicePrimitives {
    _id: string;
    name: string;
    type: string;
    ownedBy: string;
    configuration?: Object;
};