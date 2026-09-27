const fs = require('fs');
const path = require('path');

const awsExports = path.join(__dirname, 'src/aws-exports.js');

/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ['@mui/x-charts'],
  webpack: (config) => {
    // aws-exports.js が無い環境（モックモードでのローカル起動）ではスタブを使う
    if (!fs.existsSync(awsExports)) {
      config.resolve.alias['@/aws-exports'] = path.join(__dirname, 'src/aws-exports.stub.js');
    }
    return config;
  },
};
