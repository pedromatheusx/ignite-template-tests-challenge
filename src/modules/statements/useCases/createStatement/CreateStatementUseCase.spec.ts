import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "./CreateStatementUseCase"



let createStatementUseCase: CreateStatementUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe("Create Statement", () => {

    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository()
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
        
        
    })


    it("should be able to create a new Statement", async () => {

        const userCreated: ICreateUserDTO = {
            name: "Pedro",
            email: "pedromatheusduarte@gmail.com",
            password: "admin"
        }


        const { id } = await createUserUseCase.execute(userCreated)


        const response = await createStatementUseCase.execute({
            user_id: id as string,
            amount: 1000,
            description: "Deposit test",
            type: "deposit" as any
        })

        expect(response).toHaveProperty("id")
    }),

    it("should not be able to create new statement to be the user not existing", async() => {

        expect(async() => {
            await createStatementUseCase.execute({
                user_id: "id not exists",
                amount: 1000,
                description: "Deposit test",
                type: "deposit" as any
            })
        }).rejects.toBeInstanceOf(AppError)
            
    }),

    it("should not be able to withdraw money less than the balance", async() => {
       
       expect(async() => {
        const userCreated: ICreateUserDTO = {
            name: "Pedro",
            email: "pedromatheusduarte@gmail.com",
            password: "admin"
        }


        const { id } = await createUserUseCase.execute(userCreated)


        await createStatementUseCase.execute({
            user_id: id as string,
            amount: 1000,
            description: "Deposit test",
            type: "withdraw" as any
        })
       }).rejects.toBeInstanceOf(AppError)     
    }),

    it("should be able do withdraw the money",async () => {
        const userCreated: ICreateUserDTO = {
            name: "Pedro",
            email: "pedromatheusduarte@gmail.com",
            password: "admin"
        }


        const { id } = await createUserUseCase.execute(userCreated)


         await createStatementUseCase.execute({
            user_id: id as string,
            amount: 1000,
            description: "Deposit test",
            type: "deposit" as any
        })

    const response =  await createStatementUseCase.execute({
            user_id: id as string,
            amount: 50,
            description: "withdraw test",
            type: "withdraw" as any
        })

       expect(response).toHaveProperty("id")
    })

})