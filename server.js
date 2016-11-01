const app = require('./lib/app');
const http = require('http');

const server =http.createServer(app);

const port = 8080;
server.listen(port, err => {
    if (err) console.log('Error', err);
    else console.log('http server listening on port ', port);
}) 