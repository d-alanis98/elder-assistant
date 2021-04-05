//Domain
import { AuthenticationDeviceAgent } from '../UserAuthentication';

/**
 * @author Damián Alanís Ramírez
 * @version 2.1.2
 * @description User authentication agent (device) value object.
 */
export default class UserAuthenticationAgent implements AuthenticationDeviceAgent {
    readonly deviceName: string;
    readonly deviceType: string;

    constructor(deviceName: string, deviceType: string) {
        this.deviceName = deviceName;
        this.deviceType = deviceType;
    }

    public toPrimitives = (): AuthenticationDeviceAgent => ({
        deviceName: this.deviceName,
        deviceType: this.deviceType
    });
}