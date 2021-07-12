//IoTDevice domain
import { deviceEventKeys } from '../../../../../IoTDevice/domain/constants/devices';
import { IoTDeviceValidTypes } from '../../../../../IoTDevice/domain/value-objects/IoTDeviceType';
//Handlers contract
import DeviceDataHandler from './DeviceDataHandler';
//Base handler
import BaseHandler from './BaseHandler';
//Handlers
import PanicAlertHandler from './wearable/PanicAlertHandler';
import CurrentDosisHandler from './pillbox/CurrentDosisHandler';
//Utils
import ObjectHelper from '../../../../../Shared/domain/utils/ObjectHelper';

/**
 * @author Damián Alanís Ramírez
 * @version 3.4.2
 * @description Class to set the device handlers dictionary dynamically, based on the deviceEventKeys object in the devices
 * domain.
 */
export default class DeviceEventHandlers {
    //Handlers dictionary, we set this only one time.
    static deviceHandlersDictionary: HandlersDictionary = {};

    constructor() {
        this.setDeviceDataHandlers();
    }

    public get handlersDictionary() {
        return DeviceEventHandlers.deviceHandlersDictionary;
    }

    /**
     * Method to set the device data handlers, reducing the deviceEventKeys to a single dictionary of key:value pairs,
     * where key is the eventKey (i.w: PanicAlert), and the value is the route of the handler for that event, (ie: 
     * ./wearable/PanicAlertHandler.ts). 
     *
     * @returns {void}
     */
    setDeviceDataHandlers = () => {
        let existingDictionary = DeviceEventHandlers.deviceHandlersDictionary;
        //We validate the existing dictionary, if not empty, we skip the process
        if(!ObjectHelper.isEmpty(existingDictionary))
            return;
        //We get the dictionary from the reduction of the deveiceEventKeys object.
        const handlersDictionary = Object.entries(deviceEventKeys).reduce(this.eventKeysReducer, {});
        //We set the dictionary at static class property level
        DeviceEventHandlers.deviceHandlersDictionary = handlersDictionary;
    }

    /**
     * Reducer function to get the handlers dictionary.
     * @param accumulator Accumulated value of the reduce function.
     * @param {EventKeysEntry} eventKeysEntry The current deviceEventKeys entry.
     * @returns 
     */
    private eventKeysReducer = (
        accumulator: HandlersDictionary, 
        [deviceType, eventKeys]: EventKeysEntry,
    ): HandlersDictionary => ({
        ...accumulator,
        ...eventKeys.reduce((accumulated, currentKey) => ({
            ...accumulated,
            [currentKey]: this.getHandler(currentKey, deviceType)
        }), {})
    });
    
    /**
     * Method to get the reference to the handler class for an event for the specific device type.
     * 
     * The directory must be the device type to lower case, and the handler class name must be the event followed by the 
     * Handler.ts text. If no handler is found, the BaseHandler will be used instead, which only manages to send the 
     * received data via WebSockets.
     * @param {string} eventKey Identifier of the event (ie: PanicAlert).
     * @param {string} deviceType Device type (ie: PILLBOX).
     * @returns 
     */
    private getHandler = (eventKey: string, deviceType: string) => {
        try {
            const handler = eventHandlersDictionary?.[deviceType]?.[eventKey];
            if(!handler)
                throw new Error();
            return handler;
        } catch {
            return new BaseHandler();
        }
    }
}

//Types
interface HandlersDictionary {
    [eventKey: string]: DeviceDataHandler;
}

type EventKeysEntry = [
    key: string,
    value: string[]
]

interface HandlersDictionaryByEventKey {
    [deviceType: string]: HandlersDictionary;
}

//Data
const eventHandlersDictionary: HandlersDictionaryByEventKey = {
    [IoTDeviceValidTypes.WEARABLE]: {
        PanicAlert: new PanicAlertHandler(),
    },
    [IoTDeviceValidTypes.PILLBOX]: {
        CurrentDosis: new CurrentDosisHandler()
    }
}


