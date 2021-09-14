import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let showUserProfileUseCase: ShowUserProfileUseCase
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

describe("Show User Profile", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
    })

    it("should be able to list User Profile", async() => {
        const userCreate:ICreateUserDTO = {
            name: "Pedro",
            email: "pedromatheusduarte@gmail.com",
            password: "admin"
        }

        await createUserUseCase.execute(userCreate)

   const {user} = await authenticateUserUseCase.execute({
            email: userCreate.email,
            password: userCreate.password
        })



      const response =  await showUserProfileUseCase.execute(user.id as string)

     expect(response).toHaveProperty("id")
    }),

    it("should not be able to list User Profile not existing", async() => {

        expect(async() => {
            await showUserProfileUseCase.execute("1")
        }).rejects.toBeInstanceOf(AppError)
        
    })
})