import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

//Middleware que ira ser executado em todas as rotas do Appointment
appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;