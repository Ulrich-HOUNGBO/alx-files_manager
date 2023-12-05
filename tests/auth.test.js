const request = require('request');
const chai = require('chai');
const assert = require('assert');

describe("Test", () => {
    describe("GET /users/me", () => {
        it("endpoint GET /", (done) => {
            const call = {
                url: "http://localhost:5000",
                method: "GET",
            };
            request(call, (error, response, body) => {
                if (error) {
                    console.error('Error making the request:', error);
                    return done(error);
                }
                if (!response) {
                    console.error('No response received');
                    return done(new Error('No response received'));
                }
                assert.equal(response.statusCode, 200);
                if (!body) {
                    console.error('No body in the response');
                    return done(new Error('No body in the response'));
                }
                assert.equal(body, "Welcome to your profile");
                done();
            });
        });
    });
});
