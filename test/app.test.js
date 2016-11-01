const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../lib/app.js');


chai.use(chaiHttp);

describe('server responds when requested which', done => {

    const request = chai.request(server)
    let dataTest = {"name":"Harry Potter","series":"Harry Potter","type":"Wizard","location":"London","Occupation":"Student","NbrBooks":7};
    let dataChange = {"location": "Hogwarts"}
    //not including a before because I don't want the data to go away. The testing will get rid of the file.

    // before(done=>{
    //     chai.request(localHost);
    //     done();
    // });

    it('should make a file after a POST request', (done) => {
        request
        .post('/mainchar')
        .send(dataTest)
        .then(res=> {
            assert.deepEqual(res.text, 'Stored!{"name":"Harry Potter","series":"Harry Potter","type":"Wizard","location":"London","Occupation":"Student","NbrBooks":7}');
            done();
        })
        .catch(err=> {
            console.log('POST err')
            done(err);
        });
    });

    it('should replace a single value with a PUT request', (done)=> {
        request
        .put('/mainchar/4')
        .send(dataChange)
        .then(res=> {
            assert.deepEqual(res.text, 'Stored!{"name":"Harry Potter","series":"Harry Potter","type":"Wizard","location":"Hogwarts","Occupation":"Student","NbrBooks":7}')
            done();
        })
        .catch(err=> {
            console.log('PUT single err')
            done(err);
        });
    });

    it('should replace multiple values with a PUT', (done)=> {
        request
        .put('/mainchar/4')
        .send({"name":"Harry","series":"Potter"})
        .then(res=> {
            assert.deepEqual(res.text, 'Stored!{"name":"Harry","series":"Potter","type":"Wizard","location":"Hogwarts","Occupation":"Student","NbrBooks":7}')
            done();
        })
        .catch(err=> {
            console.log('PUT multiple err')
            done(err);
        });
    });

    it('should GET all files in folder', (done)=>{
        request
        .get('/mainchar')
        .then(res => {
            assert.isArray(res.body);
            done();
        })
        .catch(err=>{
            console.log('GET all err')
            done(err);
        });
    });

    it('should GET selected files', (done)=> {
        request
        .get('/mainchar/4')
        .then(res=>{
            assert.deepEqual(res.text, '[{"name":"Harry","series":"Potter","type":"Wizard","location":"Hogwarts","Occupation":"Student","NbrBooks":7}]')
            done();
        })
        .catch(err=> {
            console.log('GET selected err')
            done(err);
        });
    });

    it('should DELETE selected file', (done)=> {
        request
        .del('/mainchar/4')
        .then(res=> {
            assert.equal(res.text, 'DELETED Character');
            done();
        })
        .catch(err=> {
            console.log('DELETE err')
            done(err);
        });
    });
});