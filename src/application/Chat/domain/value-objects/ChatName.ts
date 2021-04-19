//Exceptions
import ChatNameOutOfRange from '../exceptions/ChatNameOutOfRange';
//Base value object
import StringValueObject from '../../../Shared/domain/value-object/StringValueObject';


/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Chat name value object.
 */
export default class ChatName extends StringValueObject {
    //Constraints
    static readonly MAX_LENGTH = 60;
    static readonly MIN_LENGTH = 1;


    constructor(value: string) {
        super(value);
        this.validateNameLength();
    }

    /**
     * Method to validate that the chat name is valid, according to the constraints.
     */
    private validateNameLength = () => {
        if(
            !this.value || 
            this.value.length < ChatName.MIN_LENGTH || 
            this.value.length > ChatName.MAX_LENGTH
        )
            throw new ChatNameOutOfRange();
    }
}
