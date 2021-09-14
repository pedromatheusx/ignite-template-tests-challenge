import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetBalanceUseCase } from "./GetBalanceUseCase"


let getBalanceUseCase:GetBalanceUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase
describe("Get Balance", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        inMemoryStatementsRepository = new InMemoryStatementsRepository()
        getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository,inMemoryUsersRepository )
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    })

    it("should be able list the balance all of the user", async() => {
        const userCreate:ICreateUserDTO = {
            name: "Pedro",
            email: "pedromatheusduarte@gmail.com",
            password: "admin"
        }

     const {id} = await createUserUseCase.execute(userCreate)

        await createStatementUseCase.execute({
            user_id: id as string,
            amount: 1000,
            description: "Deposit test",
            type: "deposit" as any
        })

        await createStatementUseCase.execute({
            user_id: id as string,
            amount: 1000,
            description: "Deposit test",
            type: "deposit" as any
        })

        await createStatementUseCase.execute({
            user_id: id as string,
            amount: 500,
            description: "withdraw test",
            type: "withdraw" as any
        })

       const response = await getBalanceUseCase.execute({
            user_id: id as string
        })

       expect(response.statement.length).toBe(3)
    }),

    it("should not be ble list the balance without user",async () => {
      
        expect(async() => {
            await getBalanceUseCase.execute({
                user_id: "id not existing"
            })
        }).rejects.toBeInstanceOf(AppError)
       
    })
})