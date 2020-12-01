import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import SessionsController from '@modules/users/infra/http/controllers/SessionsController';
const sessionsRouter = Router();
const sessionsController = new SessionsController();

//Rota: Receber a requisição, chamar um arquivo, devolver uma resposta.

sessionsRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
          email: Joi.string().email().required(),
          password: Joi.string().required(),  
        },
    }),
    sessionsController.create
);

export default sessionsRouter;