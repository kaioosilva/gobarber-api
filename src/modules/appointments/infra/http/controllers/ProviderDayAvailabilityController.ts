import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailabilityController {
    public async index(request: Request, response: Response): Promise<Response> {
        try {
            const { provider_id } = request.params;

            //Query = http://localhost:333/rota/year=2020&month=5&day=20
            const { day, month, year } = request.query;
    
            const listProviderDayAvailability = container.resolve(ListProviderDayAvailabilityService);
    
            const availability = await listProviderDayAvailability.execute({
                provider_id,
                day: Number(day),
                month: Number(month),
                year: Number(year),
            });
    
            return response.json(availability);
        } catch (err) {
            return response.status(400).json({ error: err.message });
        }
    }
}