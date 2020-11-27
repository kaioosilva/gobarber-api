import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';

export default class AppointmentsController {
    public async index(request: Request, response: Response): Promise<Response> {
        try {
            const user_id = request.user.id;
    
            const listProviders = container.resolve(ListProvidersService);
    
            const providers = await listProviders.execute({
                user_id
            });
    
            return response.json(providers);
        } catch (err) {
            return response.status(400).json({ error: err.message });
        }
    }
}