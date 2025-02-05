
import { taLogger } from '../js/mzta-logger.js';

const logger = new taLogger('errorLogger', true);

export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

export function logError(error, context = '') {
    const errorMessage = `${context ? `[${context}] ` : ''}${error.message}`;
    logger.error(errorMessage);
    
    if (error.stack) {
        logger.error(`Stack trace: ${error.stack}`);
    }
}

export function logInfo(message, context = '') {
    const infoMessage = `${context ? `[${context}] ` : ''}${message}`;
    logger.log(infoMessage);
}
