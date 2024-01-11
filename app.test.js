const request = require('supertest');
const connectDbAndGetApp = require('./app');
const db = require('./models/db');

describe("Test application", () => {
    let app;
    let token;

    beforeAll(async () => {
        app = await connectDbAndGetApp();

        // Login and get access token
        const loginResponse = await request(app)
            .post('/api/v1/users/login')
            .send({ username: 'admin', password: 'password123' });

        token = loginResponse.body.accessToken;
    });

    // Test for the root route
    test("It should respond to the GET method on root", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('Hello World!');
    });

    // Test for a non-existing route
    test("It should return 404 for non-existing routes", async () => {
        const res = await request(app).get("/non-existing-route");
        expect(res.statusCode).toBe(404);
    });

    // Test for /api/v1/users route with authentication
    test("It should respond to the GET method on /api/v1/users", async () => {
        const res = await request(app)
            .get("/api/v1/users")
            .set('Authorization', `bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // Test for /api/v1/customers route with authentication
    test("It should respond to the GET method on /api/v1/customers", async () => {
        const res = await request(app)
            .get("/api/v1/customers")
            .set('Authorization', `bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // Test for /api/v1/leads route with authentication
    test("It should respond to the GET method on /api/v1/leads", async () => {
        const res = await request(app)
            .get("/api/v1/leads")
            .set('Authorization', `bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // Test for /api/v1/sales route with authentication
    test("It should respond to the GET method on /api/v1/sales", async () => {
        const res = await request(app)
            .get("/api/v1/sales")
            .set('Authorization', `bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    afterAll(async () => {
        await db.end();
    });
});
