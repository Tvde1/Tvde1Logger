                require('colors'); //eslint-disable-line indent
const moment  = require('moment');

class Logger {
    
    /**
     * Creates a new logger.
     * @param {string} name The name the log output should take. Can be null to hide.
     * @param {boolean} logTime Whether or not the time should be logged.
     */
    constructor(name, logTime = false) {
        this._name = name;
        this._logTime = logTime;
        if (this._name) {
            module.exports.activeLogs.set(this._name, this);
            this._updateName(getLongestName());
        }
    }

    /**
     * Destroys the current logger. Do this before you destroy the object.
     * @param {boolean} updateNames Whether or not other names should update their padding if they can be smaller.
     */
    destroy(updateNames = true) {
        if (this._name) {
            module.exports.activeLogs.delete(this._name);
        }

        if (updateNames) {
            for (let logger of module.exports.activeLogs.keys()) {
                logger._updateName(getLongestName());
            }
        }
    }

    /**
     * "Private" function for updating names.
     */
    _updateName(longest) {
        this._displayName = `${this._name}${' '.repeat(longest - this._name.length)}`;
    }

    /**
     * Logs in the console.
     * @param {string} title The title of the log message. 
     * @param {string} description The description of the log message. Can be null.
     */
    log(title, description) {
        console.log(`${this._logTime ? getTimeString() : ''}${this._displayName ? `${this._displayName} || ` : ''}${'LOG'.green}   || ${title}${description ? ' | ' + description : ''}`); //eslint-disable-line no-console
    }

    /**
     * Logs an error in the console.
     * @param {string} title The title of the error message.
     * @param {string} description The description of the error message. Can be null.
     */
    error(title, description) {
        console.error(`${this._logTime ? getTimeString() : ''}${this._displayName ? `${this._displayName} || ` : ''}${'ERROR'.red} || ${title}${description ? ' | ' + description : ''}`); //eslint-disable-line no-console
    }
}

function getTimeString() {
    return `${moment().format('YYYY-MM-DD HH:mm:ss')} || `;
}

function getLongestName() {
    return Array.from(module.exports.activeLogs.keys()).reduce((long, str) => Math.max(long, str.length), 0);
}

module.exports = Logger;
module.exports.activeLogs = new Map();