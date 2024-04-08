// ********************** Initialize server **********************************

const server = require('../src/index'); //TODO: Make sure the path to your index.js is correctly added

// ********************** Import Libraries ***********************************

const chai = require('chai'); // Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const { assert, expect } = chai;
const pgp = require('pg-promise')()
const statusCodes = require('../src/statusCodes');

const dbConfig = {
    host: 'db',
    port: 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
};

const db = pgp(dbConfig);

// ********************** DEFAULT WELCOME TESTCASE ****************************

describe('Server', () => {
    // Sample test case given to test / endpoint.
    it('Returns the default welcome message', done => {
        chai
            .request(server)
            .get('/welcome')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.status).to.equals('success');
                assert.strictEqual(res.body.message, 'Welcome!');
                done();
            });
    });
});

// *********************** TODO: WRITE 2 UNIT TESTCASES **************************

describe('Register', () => {
    it('positive: register user', done => {
        db.none("DELETE FROM users WHERE username = 'testuser';").then(() => {
            chai.request(server)
                .post('/register')
                .send({ username: 'testuser', password: 'hash' })
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    res.should.be.html
                    done()
                });
        })
    })
    it('negative: register user, no username or password entered', done => {
        chai.request(server)
            .post('/register')
            .send({}) // no username or password entered
            .end((err, res) => {
                res.status.should.be.oneOf([231, 232]) // bad request
                done()
            });
    })
});

describe('Login', () => {
    before(async () => {
        await db.none("DELETE FROM users WHERE username = 'testuser';")
        return chai.request(server)
            .post('/register')
            .send({ username: 'testuser', password: 'test' })
    })
    it('positive: login', done => {
        chai.request(server)
            .post('/login')
            .send({ username: 'testuser', password: 'test' })
            .end((err, res) => {
                expect(res).to.have.status(200)
                res.should.be.html
                done()
            })
    })
    it('negative: login', done => {
        chai.request(server)
            .post('/login')
            .send({ username: 'doesnotexist', password: 'incorrect' })
            .end((err, res) => {
                expect(res).to.have.status(statusCodes.USER_NOT_FOUND)
                res.should.be.html
                done()
            })
    })
})

// ********************************************************************************