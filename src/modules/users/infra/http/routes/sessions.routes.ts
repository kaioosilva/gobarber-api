import { Router } from 'express';

import SessionsController from '@modules/users/infra/http/controllers/SessionsController';
const sessionsRouter = Router();
const sessionsController = new SessionsController();

//Rota: Receber a requisição, chamar um arquivo, devolver uma resposta.

sessionsRouter.post('/', sessionsController.create);

export default sessionsRouter;