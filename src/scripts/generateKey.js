/**
 * Custom script to generate a unique HEX key of the desired length, if no length is specified, it'll generate a 32 bytes
 * one. It makes use of the crypto native module in Node JS.
 */
const { applyStyles, RED_COLOR, CYAN_COLOR, YELLOW_COLOR, GREEN_COLOR, YELLOW_BACKGROUND } = require('../utils/cliStyles');
const { keyGenerator } = require('../utils/keyGenerator');


//Constants
const DEFAULT_NUMBER_OF_BYTES   = 32;

//Number of bytes to produce
let numberOfBytes = DEFAULT_NUMBER_OF_BYTES;
//Arguments validation
if(process.argv.length === 2)
    console.log(
        applyStyles(
            YELLOW_COLOR, 
            `Number of bytes not provided, producing default number = ${numberOfBytes}`
    ));

else {
    try {
        let indexOfParameter = process.argv.indexOf('-n');
        if(indexOfParameter === -1)
            throw new Error();
        numberOfBytes = Number(process.argv[indexOfParameter + 1]);
        console.log(`Generating key of ${numberOfBytes} bytes`);
    } catch {
        numberOfBytes = DEFAULT_NUMBER_OF_BYTES;
        console.log(
            applyStyles(
                [ YELLOW_BACKGROUND, RED_COLOR ],
                `ERROR: Received number of bytes is not valid, using default value (${numberOfBytes} bytes)`
        ));
    }
}

const getKeyLabel = () => applyStyles(
    CYAN_COLOR, 
    'Key: '
);

const getPrettyKey = () => `\n\n${getKeyLabel()}${
    applyStyles(
        GREEN_COLOR, 
        keyGenerator(numberOfBytes)
    )
}`;


console.log(getPrettyKey());


