import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

export default class ProviderAppointmentsController {
    public async index(request: Request, response: Response): Promise<Response> {
        try {
            //Query = http://localhost:333/rota/year=2020&month=5&day=20
            const { day, month, year } = request.query;
            const provider_id = request.user.id;
    
            const listProviderAppointments = container.resolve(ListProviderAppointmentsService);
    
            const appointments = await listProviderAppointments.execute({ 
                provider_id, 
                day: Number(day),
                month: Number(month),
                year: Number(year), 
            });
    
            return response.json(appointments);
        } catch (err) {
            return response.status(400).json({ error: err.message });
        }
    }
}