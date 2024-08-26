"use server"
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const logsDir = path.join(__dirname, '../../logs');

if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

function getLogFileName(file_name: string) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return path.join(logsDir, `log_${file_name}_${year}-${month}-${day}.log`);
}

function Logs(file_name: string, message: any) {
    if(process.env.NODE_ENV !== 'development'  && typeof window === 'undefined'){
        const logFilePath = getLogFileName(file_name);
        const timestamp = new Date().toLocaleString();
        fs.appendFile(logFilePath, `[${timestamp}] ${message}\n`, (err: any) => {
            if (err) {
                console.error('failed write log:', err);
            }
        });
    } else {
        console.log(file_name, message)
    }
}

function formatDateToIndonesianTime(date: number | Date | undefined) {
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'full',
        timeStyle: 'long',
        timeZone: 'Asia/Jakarta',
    }).format(date);
}

export { Logs, formatDateToIndonesianTime };