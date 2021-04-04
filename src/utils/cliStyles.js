const RESET_STYLES = '\x1b[0m';


module.exports = {
    //Font color
    RED_COLOR: '\x1b[31m',
    BLUE_COLOR: '\x1b[34m',
    CYAN_COLOR: '\x1b[36m',
    GREEN_COLOR: '\x1b[32m',
    WHITE_COLOR: '\x1b[37m',
    BLACK_COLOR: '\x1b[30m',
    YELLOW_COLOR: '\x1b[33m',
    MAGENTA_COLOR: '\x1b[35m',
    //Background color
    RED_BACKGROUND: '\x1b[41m',
    BLUE_BACKGROUND: "\x1b[44m",
    CYAN_BACKGROUND: "\x1b[46m",
    BLACK_BACKGROUND: "\x1b[40m",
    GREEN_BACKGROUND: "\x1b[42m",
    WHITE_BACKGROUND: "\x1b[47m",
    YELLOW_BACKGROUND: "\x1b[43m",
    MAGENTA_BACKGROUND: "\x1b[45m",
    //Actions
    applyStyles:  (styles, text) => `${Array.isArray(styles) 
        ? styles.join(' ')
        : String(styles)
    }${text}${RESET_STYLES}`
}