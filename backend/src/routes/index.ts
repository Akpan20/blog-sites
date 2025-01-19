import { Router } from 'express';
import authRoutes from './auth';
import categoryRoutes from './categories';
import commentsRoutes from './comments';
import postRoutes from './posts';
import profileRoutes from './profile';
import reactionRoutes from './reaction';
import searchRoutes from './search';
import userRoutes from './user';
import tagsRoutes from './tags';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/categories', categoryRoutes);
routes.use('/comments', commentsRoutes);
routes.use('/posts', postRoutes);
routes.use('/profile', profileRoutes);
routes.use('/reaction', reactionRoutes);
routes.use('/search', searchRoutes);
routes.use('/users', userRoutes);
routes.use('/tags', tagsRoutes);


export default routes;
