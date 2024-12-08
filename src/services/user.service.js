import boom from '@hapi/boom';
import userRepository from "../repositories/user.repository.js";
import { USER_MESSAGES } from '../api/constants/messages.js';

class UserService {
    constructor() {
        this.userRepository = userRepository;
    }

    async getProfile(userId) {
        const profile = await this.userRepository.getProfile(userId);
        if (!profile) {
            throw boom.notFound(USER_MESSAGES.PROFILE.GET.NOT_FOUND);
        }
        return profile;
    }

    async updateProfile(userId, updateData) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw boom.notFound('Usuario no encontrado');
        }

        if (user.role === "admin" && updateData.department) {
            throw boom.badRequest('No se puede actualizar el perfil de un administrador');
        }

        return await this.userRepository.updateProfile(userId, updateData);
    }

}

export default new UserService();