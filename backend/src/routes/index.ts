import express from 'express';
import categoriesRouter from './category';
import tagsRouter from './tag';
import usersRouter from './user';
import postsRouter from './post';
import commentsRouter from './comment';
import reactionsRouter from './reaction';
import rolesRouter from './role';
import userActivityRouter from './userActivity';
import userTrustRouter from './userTrust';
import postStatusRouter from './postStatus';
import postVersionsRouter from './postVersion';
import searchRouter from './search';

const router = express.Router();

router.use('/categories', categoriesRouter);
router.use('/tags', tagsRouter);
router.use('/users', usersRouter);
router.use('/posts', postsRouter);
router.use('/comments', commentsRouter);
router.use('/reactions', reactionsRouter);
router.use('/roles', rolesRouter);
router.use('/user-activities', userActivityRouter);
router.use('/user-trusts', userTrustRouter);
router.use('/post-versions', postVersionsRouter);
router.use('/posts', postStatusRouter);
router.use('/searches', searchRouter);

export default router;