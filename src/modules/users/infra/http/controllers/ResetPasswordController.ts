import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ResetPasswordService from '@modules/users/services/ResetPasswordService';

export default class ResetPasswordController {
    public async create(request: Request, response: Response): Promise<Response> {
        try {
            const { password, token } = request.body;
    
            const resetPasswordEmailService = container.resolve(ResetPasswordService);
    
            await resetPasswordEmailService.execute({
                token,
                password,
            });
            return response.status(204).json();
        } catch (err) {
            return response.status(err.statusCode).json({ error: err.message });
        }
    }
}