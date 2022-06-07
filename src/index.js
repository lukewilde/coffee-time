const config = require('./config');

const env = config.get('env');
const port = config.get('port');

console.log(`${env} ${port}`);
