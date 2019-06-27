import { Router } from 'express';

import UserController from '../src/app/controllers/UserController';
// import SessionController from '';

import authMiddleware from '../src/app/middlewares/auth';

const routes = new Router();

// routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

export default routes;
