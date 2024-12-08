import { USER_MESSAGES } from '../api/constants/messages.js';
import userService from '../services/user.service.js';

export class UserController {
    constructor() {
        this.userService = userService;
    }

    getProfile = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const profile = await this.userService.getProfile(userId);

            res.json({
                status: 'success',
                message: USER_MESSAGES.PROFILE.GET.SUCCESS,
                data: { profile }
            });
        } catch(error) {
            next(error);
        }
    }

    updateProfile = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const updateData = req.body;
    
            const updatedUser = await this.userService.updateProfile(userId, updateData);
            
            res.json({
                status: 'success',
                message: USER_MESSAGES.PROFILE.UPDATE.SUCCESS,
                data: { user: updatedUser }
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();
