const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const appRoot = require('app-root-path');
const process = require('process');

const logDir = `${appRoot}/logs`;

const {
    combine,
    timestamp,
    label,
    printf
} = winston.format;

const logFormat = printf(({
    levlel,
    message,
    label,
    timestamp
}) => {
    return `${timestamp} [${label}] ${level}: ${message}`; //log 출력 포맷 정의
});

const logger = winston.createLogger({
    format:combine(
        label({
            label:'LogTestSystem'
        }),
        timestamp({
            format:'YYYY-MM-DD HH:mm:ss',
        }),
        logFormat
    ),
    transports: [
        new winstonDaily({
            level:'info',
            datePattern:'YYYY-MM-DD',
            dirname:logDir,
            filename: `%DATE% log`,
            maxFiles:30,
            zippedArchive:true,
        }),
        new winstonDaily({
            levl:'error',
            datePattern:'YYYY-MM-DD',
            dirname:logDir,
            filename:`%DATE%.error.log`,
            maxFiles:30,
            zippedArchive:true,
        })
    ],
    exceptionHandlers: [//uncaughtException 발생시
        new winstonDaily({
            level:'error',
            datePattern:'YYYY-MM-DD',
            dirname:logDir,
            filename:`%DATE%.exception.log`,
            maxFiles:30,
            zippedArchive:true,
        })
    ]
});

//Production 환경이 아닌 경우 
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format:winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
        )
    }));
}

module.exports=logger;
