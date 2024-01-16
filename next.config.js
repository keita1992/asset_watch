/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ['@mui/x-charts'],
  env: {
    REGION: process.env.REGION,
    ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
  }
}
