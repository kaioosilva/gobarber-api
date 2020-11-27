import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class ProviderMonthAvailabilityController {
    public async index(request: Request, response: Response): Promise<Response> {
        try {
            const { provider_id } = request.params;
            const { month, year } = request.body;

            const listProviderMonthAvailability = container.resolve(ListProviderMonthAvailabilityService);
    
            const availability = await listProviderMonthAvailability.execute({
                provider_id,
                month,
                year,
            });
    
            return response.json(availability);
        } catch (err) {
            return response.status(400).json({ error: err.message });
        }
    }
}