import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"

let authenticateUserUseCase: AuthenticateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe("Authenticate User", () => {

beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
})

it("should be able to authenticate an user", async() => {
    const createUser:ICreateUserDTO = {
        name: "Pedro",
        email: "pedromatheusduarte@gmail.com",
        password: "admin"
    }

  await createUserUseCase.execute(createUser)

 
   const response = await authenticateUserUseCase.execute({
       email: createUser.email,
       password: createUser.password      
   })

   expect(response).toHaveProperty("token")
}),

it("should not be able to authenticate an nonexistent user",async () => {

    expect(async() => {
         await authenticateUserUseCase.execute({
            email: "false@gmail.com",
            password: "admin"
        })
    }).rejects.toBeInstanceOf(AppError)
    
}),

it("should not be able to authenticate with incorrent password", async() => {
  
  expect(async() => {
    const createUser:ICreateUserDTO = {
        name: "Pedro",
        email: "pedromatheusduarte@gmail.com",
        password: "admin"
    }

  await createUserUseCase.execute(createUser)

 
    await authenticateUserUseCase.execute({
       email: createUser.email,
       password: "false"     
   })
  }).rejects.toBeInstanceOf(AppError)
    
})

})