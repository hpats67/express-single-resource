const server = require('./lib/http-server');

const port = 8080;
server.listen(port, err => {
    if (err) console.log('Error', err);
    else console.log('http server listening on port ', port);
}) 