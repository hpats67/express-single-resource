const http = require('http');
const express = require('express');
const app = express();
const dataStore = require('./dataStore.js');

function bodyParser(req, cb) {
    let body = '';

    req.on('data', (data) => {
        body += data;
    });

    req.on('end', () => {
        try {
            cb(null, JSON.parse(body));
        }
        catch (err) {
            cb(err);
        }
    });
};

app.get('/mainchar', (req, res)=> { 
    dataStore.getAll()
    .then((fileNames)=> {
        return Promise.all(fileNames.map((fn)=> {
            return dataStore.getData(fn);
        }))
    })
    .then((data)=> {
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(data));
        res.end();
    })
    .catch((err)=> {
        res.statusCode = 404;
        res.write(err.message);
        res.end();
    })
})

app.get('/mainchar/:id', (req, res)=> {
    console.log(req.params.id)
    let selected = (req.params.id).split(',');
    Promise.all(selected.map((fn) => {
        return dataStore.getData(fn + '.json')
    }))
    .then((data)=> {
        // console.log('grabbed', data);
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(data));
        res.end();
    })
    .catch((err)=> {
        res.statusCode = 404;
        res.write(err.message);
        res.end();
    })
})

app.post('/mainchar', (req, res)=> {
    bodyParser(req, (err, obj) => {
        if(err){
            res.statusCode = 400;
            res.end(err.message);
        }
        else {
            dataStore.store(obj)
            .then((data) => {
                // console.log('data', data);
                res.write('Stored!')
                res.write(data);
                res.end();
            })
            .catch((err) => {
                res.statusCode = 500;
                res.end(err.message);
            })
        }
    })
})

app.put('/mainchar/:id', (req, res)=> {
    bodyParser(req,(err, obj) =>{
        if(err){
            res.statusCode = 400;
            res.end(err.message);
        }
        else {
            let id = req.params.id;
            let fileId = id + '.json';
            dataStore.update(obj, fileId)
            .then((updated)=> {
                res.write('Stored!');
                res.write(updated);
                res.end();
            })
            .catch((err) => {
                res.statusCode = 500;
                res.end(err.message);
            })
        }
    })
})


app.delete('/mainchar/:id', (req, res)=> {
    dataStore.destroy(req.params.id)
    .then((confirm)=> {
        res.write(confirm);
        res.end();
    })
    .catch((err) => {
        res.statusCode = 500;
        res.end(err.message);
    })
})

module.exports = app;

