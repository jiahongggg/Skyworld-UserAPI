const request = require('supertest');
const connectDbAndGetApp = require('./app');
const db = require('./models/db');

describe("Test application", () => {
    let app;
    let token;
    let createdCustomerUUID;
    let createdLeadUUID;
    let createdSaleID;

    beforeAll(async () => {
        app = await connectDbAndGetApp();

        // Login and get access token
        const loginResponse = await request(app)
            .post('/api/v1/users/login')
            .send({ username: 'admin', password: 'password123' });

        token = loginResponse.body.accessToken;
    });

    describe("Root and non-existing routes", () => {
        test("GET / should respond with 'Hello World!'", async () => {
            const res = await request(app).get("/");
            expect(res.statusCode).toBe(200);
            expect(res.text).toBe('Hello World!');
        });

        test("GET /non-existing-route should return 404", async () => {
            const res = await request(app).get("/non-existing-route");
            expect(res.statusCode).toBe(404);
        });
    });

    describe("Authenticated routes", () => {
        const routesToTest = [
            { path: "/api/v1/users", isArray: true },
            { path: "/api/v1/customers", isArray: true },
            { path: "/api/v1/leads", isArray: true },
            { path: "/api/v1/sales", isArray: true },
        ];

        routesToTest.forEach(({ path, isArray }) => {
            test(`GET ${path} should respond with ${isArray ? 'an array' : '200'}`, async () => {
                const res = await request(app)
                    .get(path)
                    .set('Authorization', `bearer ${token}`);

                if (isArray) {
                    expect(Array.isArray(res.body)).toBe(true);
                } else {
                    expect(res.statusCode).toBe(200);
                }
            });
        });
    });

    describe("Customer CRUD operations", () => {
        // Test for creating a customer
        test("It should create a customer", async () => {
            const customerData = {
                CustomerLeadID: '100028',
                CustomerProfile: 'A',
                CustomerName: 'John Doe',
                CustomerEmail: 'johndoe12345@yahoo.com',
                CustomerContactNo: '0123232323',
                CustomerICPassportNo: 'AX1209314',
                CustomerGender: 'Male',
                CustomerSalutation: 'Mr.',
                CustomerOccupation: 'Software Engineer',
                CustomerNationality: 'Malaysia',
                CustomerAddress: {
                    Address: '123 Jalan Tun Perak',
                    Postcode: '50050',
                    City: 'Kuala Lumpur',
                    State: 'Wilayah Persekutuan',
                    Country: 'Malaysia',
                },
                CustomerAddress2: null,
                CustomerAddress3: null,
                CustomerDateOfBirth: '1990-01-01',
                CustomerIncome: 75000.0,
                CustomerMaritalStatus: 'Married',
                CustomerRace: 'Cina',
                CustomerIsBumi: true,
                CustomerIsCorporate: false,
                CustomerPreferredLanguage: 'English',
                CustomerBeneficiaryID: 1,
                CustomerMotherMaidenName: 'Smith',
                CustomerEmergencyContactID: 1,
                Remark: '',
            };

            const res = await request(app)
                .post("/api/v1/customers")
                .set('Authorization', `bearer ${token}`)
                .send(customerData);

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('message', 'Customer created successfully');
            expect(res.body).toHaveProperty('CustomerUUID');

            // Store the UUID of the created customer for subsequent tests
            createdCustomerUUID = res.body.CustomerUUID;
        });

        // Test for getting a customer by ID
        test("It should get a customer by ID", async () => {
            // Use the UUID of the created customer
            const customerId = createdCustomerUUID;

            const res = await request(app)
                .get(`/api/v1/customers/${customerId}`)
                .set('Authorization', `bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('CustomerUUID', customerId);
        });

        // Test for updating a customer by ID
        test("It should update a customer by ID", async () => {
            // Use the UUID of the created customer
            const customerId = createdCustomerUUID;

            const updatedCustomerData = {
                CustomerName: 'Updated Name',
            };

            const res = await request(app)
                .put(`/api/v1/customers/${customerId}`)
                .set('Authorization', `bearer ${token}`)
                .send(updatedCustomerData);

            expect(res.statusCode).toBe(200);
            // Check any response properties as needed
        });

        // Test for deleting a customer by ID
        test("It should delete a customer by ID", async () => {
            // Use the UUID of the created customer
            const customerId = createdCustomerUUID;

            const res = await request(app)
                .delete(`/api/v1/customers/${customerId}`)
                .set('Authorization', `bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Customer deleted');
        });
    });

    describe("Lead CRUD operations", () => {
        // Test for creating a lead
        test("It should create a lead", async () => {
            const leadData = {
                "LeadName": "Olivia Johnson",
                "LeadEmail": "oliviajohnson@example.com",
                "LeadContactNo": "0123456789",
                "LeadICPassportNo": "A1234567",
                "LeadGender": "Female",
                "LeadSalutation": "Ms.",
                "LeadOccupation": "Marketing Executive",
                "LeadNationality": "Malaysia",
                "LeadAddress": {
                    "Address": "123 Jalan Raja",
                    "Postcode": "12345",
                    "City": "Kuala Lumpur",
                    "State": "Wilayah Persekutuan",
                    "Country": "Malaysia"
                },
                "LeadStatus": 1,
                "LeadDateOfBirth": "1990-01-15",
                "LeadIncome": 5000.50,
                "LeadMaritalStatus": "Single",
                "LeadRace": "Malay",
                "LeadIsBumi": 1,
                "LeadInterestType1": null,
                "LeadInterestType2": null,
                "LeadIsExistingBuyer": 0,
                "LeadTag": 1,
                "Remark": ""
            };

            const res = await request(app)
                .post("/api/v1/leads")
                .set('Authorization', `bearer ${token}`)
                .send(leadData);

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('message', 'Lead created successfully');
            expect(res.body).toHaveProperty('LeadUUID');
            createdLeadUUID = res.body.LeadUUID;
        });

        // Test for getting a lead by ID
        test("It should get a lead by ID", async () => {
            const res = await request(app)
                .get(`/api/v1/leads/${createdLeadUUID}`)
                .set('Authorization', `bearer ${token}`);

            expect(res.statusCode).toBe(200);
            // Check response properties as needed
        });

        // Test for updating a lead by ID
        test("It should update a lead by ID", async () => {
            const updatedLeadData = {
                LeadName: 'Updated Name',
            };

            const res = await request(app)
                .put(`/api/v1/leads/${createdLeadUUID}`)
                .set('Authorization', `bearer ${token}`)
                .send(updatedLeadData);

            expect(res.statusCode).toBe(200);
            // Check any response properties as needed
        });

        // Test for deleting a lead by ID
        test("It should delete a lead by ID", async () => {
            const res = await request(app)
                .delete(`/api/v1/leads/${createdLeadUUID}`)
                .set('Authorization', `bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Lead deleted');
            // Check any other response properties as needed
        });
    });

    describe("Sale CRUD operations", () => {
        // Test for creating a sale
        test("It should create a sale", async () => {
            const saleData = {
                "AgentName": "Ahmad Bin Ali",
                "AgentAge": 35,
                "AgentGender": "Male",
                "AgentEmail": "ahmad.ali@example.com",
                "AgentICPassportNo": "A1234567",
                "AgentSalutation": "Mr.",
                "AgentNationality": "Malaysia",
                "AgentContactNo": "+60123456789",
                "AgentAddress": {
                    "Address": "123, Jalan Bukit Bintang",
                    "Postcode": "50050",
                    "City": "Kuala Lumpur",
                    "State": "Wilayah Persekutuan",
                    "Country": "Malaysia"
                }
            };

            const res = await request(app)
                .post("/api/v1/sales")
                .set('Authorization', `bearer ${token}`)
                .send(saleData);

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('message', 'Sales created successfully');
            expect(res.body).toHaveProperty('SalesAgentID');
            createdSaleID = res.body.SalesAgentID;
        });

        // Test for getting a sale by ID
        test("It should get a sale by ID", async () => {
            const res = await request(app)
                .get(`/api/v1/sales/${createdSaleID}`)
                .set('Authorization', `bearer ${token}`);

            expect(res.statusCode).toBe(200);
            // Check response properties as needed
        });

        // Test for updating a sale by ID
        test("It should update a sale by ID", async () => {
            const updatedSaleData = {
                AgentName: 'Updated Name',
            };

            const res = await request(app)
                .put(`/api/v1/sales/${createdSaleID}`)
                .set('Authorization', `bearer ${token}`)
                .send(updatedSaleData);

            expect(res.statusCode).toBe(200);
            // Check any response properties as needed
        });

        // Test for deleting a sale by ID
        test("It should delete a sale by ID", async () => {
            const res = await request(app)
                .delete(`/api/v1/sales/${createdSaleID}`)
                .set('Authorization', `bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Sales deleted');
            // Check any other response properties as needed
        });
    });

    afterAll(async () => {
        await db.end();
    });
});
