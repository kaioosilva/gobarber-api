import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';
import ProviderAppointmentsController from '@modules/appointments/infra/http/controllers/ProviderAppointmetsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

//Middleware que ira ser executado em todas as rotas do Appointment
appointmentsRouter.use(ensureAuthenticated);

//Validação das rotas utilizando celebrate
appointmentsRouter.post(
    '/', 
    celebrate({
        [Segments.BODY]: {
            provider_id: Joi.string().uuid().required(),
            date: Joi.date(),
        },
    }), 
    appointmentsController.create
);

appointmentsRouter.get('/me', providerAppointmentsController.index);

export default appointmentsRouter;