import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

describe("Create User", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    })

    it("should be able to create a new user ",async() => {

        const user = {
            name: "pedro",
            email: "pedromatheusduarte@gmail.com",
            password: "1234"
        }

       await createUserUseCase.execute(user)

      const userCreated = await inMemoryUsersRepository.findByEmail(user.email)

        expect(userCreated).toHaveProperty("id")
    }),

    it("should not be able to create a new user with name exists", async() => {
     
     
        expect(async() => {

            const user = {
                name: "pedro",
                email: "pedromatheusduarte@gmail.com",
                password: "1234"
            }
    
           await createUserUseCase.execute(user)
           await createUserUseCase.execute(user)
    
        }).rejects.toBeInstanceOf(AppError)
        

    })
})