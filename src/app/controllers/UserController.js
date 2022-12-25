import UsersRepository from '../repositories/UsersRepository.js'
class UserController {
    async index(request, response) {
        
    }
    async store(request, response) {
        const data = request.body;
        const user = await UsersRepository.create(data);
        return response.json(user)
    }
    async update(request, response) {

    }
    async delete(request, response) {
        
    }
}

export default new UserController;