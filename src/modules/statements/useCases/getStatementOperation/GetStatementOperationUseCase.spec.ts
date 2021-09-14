import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"


let getStatementOperationUseCase: GetStatementOperationUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase
let getBalanceUseCase: GetBalanceUseCase

describe("Get Statement Operation", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        inMemoryStatementsRepository = new InMemoryStatementsRepository()
        getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
        getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
    })

    it("should be able consult the deposit", async () => {
        const userCreate: ICreateUserDTO = {
            name: "Pedro",
            email: "pedromatheusduarte@gmail.com",
            password: "admin"
        }

        const { id } = await createUserUseCase.execute(userCreate)

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

        const { id: id_statement } = response.statement[0]

        const result = await getStatementOperationUseCase.execute({
            user_id: id as string,
            statement_id: id_statement as string
        })

        expect(result.id).toBe(id_statement)
        expect(result.user_id).toBe(id)
    }),

        it("should be able consult the withdraw", async () => {
            const userCreate: ICreateUserDTO = {
                name: "Pedro",
                email: "pedromatheusduarte@gmail.com",
                password: "admin"
            }

            const { id } = await createUserUseCase.execute(userCreate)

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

            const { id: id_statement } = response.statement[1]

            const result = await getStatementOperationUseCase.execute({
                user_id: id as string,
                statement_id: id_statement as string
            })

            expect(result.id).toBe(id_statement)
            expect(result.user_id).toBe(id)
        }),

        it("should not be ble list the Get Statement Operation without user",async () => {
      
           expect(async() => {
            await getStatementOperationUseCase.execute({
                statement_id: "1",
                user_id: "id not exists"
             })
           }).rejects.toBeInstanceOf(AppError)
               
           
           
        })
})