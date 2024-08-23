/* eslint-disable import/no-anonymous-default-export */
import dotenv from 'dotenv';
dotenv.config();

export const options = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dialect: "postgres",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  define: {
    timestamps: true,
  },
};

export default {
  development: options,
  test: options,
  production: options,
};