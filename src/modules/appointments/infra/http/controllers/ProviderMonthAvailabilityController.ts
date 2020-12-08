import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class ProviderMonthAvailabilityController {
    public async index(request: Request, response: Response): Promise<Response> {
        try {
            const { provider_id } = request.params;
            
            //Query = http://localhost:333/rota/year=2020&month=5
            const { month, year } = request.query;

            const listProviderMonthAvailability = container.resolve(ListProviderMonthAvailabilityService);
    
            const availability = await listProviderMonthAvailability.execute({
                provider_id,
                month: Number(month),
                year: Number(year),
            });
    
            return response.json(availability);
        } catch (err) {
            return response.status(400).json({ error: err.message });
        }
    }
}