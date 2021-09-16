
import request from "supertest";
import { Connection, createConnection} from "typeorm";
import { app } from "../../../../app";

let connection:Connection
describe("Authenticate User Controller", () => {

    beforeAll(async() => {
        connection = await createConnection()
       await connection.runMigrations()
     })

     afterAll(async() => {
       await connection.dropDatabase()
       await connection.close()
     })
    
    it("should be able to authenticate an user", async() => {
        await request(app).post("/api/v1/users").send({
            name: "Pedro",
            email: "pedro@gmail.com",
            password: "admin"
        })

       const response = await request(app).post("/api/v1/sessions").send({
            email: "pedro@gmail.com",
            password: "admin"
        })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("token")
        


    }),

    it("should not be able to authenticate an nonexistent user", async() => {
        const response = await request(app).post("/api/v1/sessions").send({
            email: "matheus@gmail.com",
            password: "admin"
        })

        expect(response.status).toBe(401)
    }),

    it("should not be able to authenticate with incorrent password", async() => {
        const response = await request(app).post("/api/v1/sessions").send({
            email: "pedro@gmail.com",
            password: "incorrent"
        })

        expect(response.status).toBe(401)   
        expect(response.body).toHaveProperty("message")     
  
    })
})