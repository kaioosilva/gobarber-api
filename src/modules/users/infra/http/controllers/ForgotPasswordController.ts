import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';

export default class ForgotPasswordController {
    public async create(request: Request, response: Response): Promise<Response> {
        try {
            const { email } = request.body;
    
            const sendForgotPasswordEmailService = container.resolve(SendForgotPasswordEmailService);
    
            await sendForgotPasswordEmailService.execute({
                email,
            });
            return response.status(204).json();
        } catch (err) {
            return response.status(err.statusCode).json({ error: err.message });
        }
    }
}