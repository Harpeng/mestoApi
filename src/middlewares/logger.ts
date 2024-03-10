// eslint-disable-next-line import/no-extraneous-dependencies
import winston from 'winston';
// eslint-disable-next-line import/no-extraneous-dependencies
import expressWinston from 'express-winston';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'winston-daily-rotate-file';

const transport = new winston.transports.DailyRotateFile({
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  maxSize: '20m',
  maxFiles: 14,
  zippedArchive: true,
});

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({
      filename: 'request.log',
    }),
  ],
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    transport,
  ],
  format: winston.format.json(),
});

export {
  requestLogger,
  errorLogger,
};
