import request from "supertest"
import { Connection, createConnection } from "typeorm"
import { app } from "../../../../app"

let connection: Connection
describe("Get Statement Operation Controller", () => {
    
    beforeAll(async() => {
    connection = await createConnection()
    await connection.runMigrations()
    })

    afterAll(async() => {
    await connection.dropDatabase()
    await connection.close()
    })
    
    it("should be able consult the deposit",async () => {
        await request(app).post("/api/v1/users").send({
            name: "Pedro",
            email: "pedrox@gmail.com",
            password: "admin"
        })

      const responseSession =  await request(app).post("/api/v1/sessions").send({
            email: "pedrox@gmail.com",
            password: "admin"
        })

        const {token} = responseSession.body

     await request(app).post("/api/v1/statements/deposit").send({
        'amount': 100,
        'description': "Deposit"
     }).set({
            'Authorization': `Bearer ${token}`
        })

        await request(app).post("/api/v1/statements/withdraw").send({
            'amount': 5,
            'description': "withdraw"
         }).set({
                'Authorization': `Bearer ${token}`
            })

         const response = await request(app).get("/api/v1/statements/balance")
            .set({
                'Authorization': `Bearer ${token}`
            })
            const {id} = response.body.statement[0]
            
           const result = await request(app).get(`/api/v1/statements/${id}`)
            .set({
                'Authorization': `Bearer ${token}`
            })

            expect(result.status).toBe(200)
            expect(result.body).toHaveProperty("id")
    })
    it("should be able consult the withdraw",async () => {
        await request(app).post("/api/v1/users").send({
            name: "Pedro",
            email: "pedrox@gmail.com",
            password: "admin"
        })

      const responseSession =  await request(app).post("/api/v1/sessions").send({
            email: "pedrox@gmail.com",
            password: "admin"
        })

        const {token} = responseSession.body

     await request(app).post("/api/v1/statements/deposit").send({
        'amount': 100,
        'description': "Deposit"
     }).set({
            'Authorization': `Bearer ${token}`
        })

        await request(app).post("/api/v1/statements/withdraw").send({
            'amount': 5,
            'description': "withdraw"
         }).set({
                'Authorization': `Bearer ${token}`
            })

         const response = await request(app).get("/api/v1/statements/balance")
            .set({
                'Authorization': `Bearer ${token}`
            })
            const {id} = response.body.statement[1]
            
           const result = await request(app).get(`/api/v1/statements/${id}`)
            .set({
                'Authorization': `Bearer ${token}`
            })

            expect(result.status).toBe(200)
            expect(result.body).toHaveProperty("id")
    })

    it("should not be ble list the Get Statement Operation without user",async () => {
        await request(app).post("/api/v1/users").send({
            name: "Pedro",
            email: "pedrox@gmail.com",
            password: "admin"
        })

      const responseSession =  await request(app).post("/api/v1/sessions").send({
            email: "pedrox@gmail.com",
            password: "admin"
        })

        const {token} = responseSession.body

     await request(app).post("/api/v1/statements/deposit").send({
        'amount': 100,
        'description': "Deposit"
     }).set({
            'Authorization': `Bearer ${token}`
        })

        await request(app).post("/api/v1/statements/withdraw").send({
            'amount': 5,
            'description': "withdraw"
         }).set({
                'Authorization': `Bearer ${token}`
            })

         const response = await request(app).get("/api/v1/statements/balance")
            .set({
                'Authorization': `Bearer ${token}`
            })
            const {id} = response.body.statement[1]
            
           const result = await request(app).get(`/api/v1/statements/${id}`)
            .set({
                'Authorization': `Bearer Token invalid`
            })

            expect(result.status).toBe(401)
            expect(result.body).toHaveProperty("message")
            
    })

})