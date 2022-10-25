import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FeedCollection from './collection';
import * as userValidator from '../user/middleware';
import * as feedValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get the Feed for the current user
 *
 * @name GET /api/feed
 *
 * @return {FeedResponse} 
 * @throws {403} - If user not logged in or Feed does not exist
 *
 */
router.get(
    '/',
    [
      userValidator.isUserLoggedIn,
      feedValidator.isFeedNotExists
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
      const feed = await FeedCollection.findByUserId(userId);
      res.status(200).json(util.constructFeedResponse(feed));
    }
);

/**
 * Create a new Feed for current user
 *
 * @name POST /api/feed
 *
 * @param {boolean} isRecommendedEnabled - Whether recommended content is allowed in Feed
 * @return {FeedResponse} - The created Feed
 * @throws {403} - If the user is not logged in
 * @throws {400} - If isRecommendedEnabled is not true or false
 */
router.post(
    '/',
    [
      userValidator.isUserLoggedIn,
      feedValidator.isFeedAlreadyExists,
      feedValidator.isValidRecommendedEnabled
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
      const feed = await FeedCollection.addOne(userId, req.body.isRecommendedEnabled);
  
      res.status(201).json({
        message: 'Your Feed was created successfully.',
        feed: util.constructFeedResponse(feed)
      });
    }
);

/**
 * Modify the current user's Feed
 *
 * @name PUT /api/feed
 *
 * @param {boolean} isRecommendedEnabled - Whether recommended content is allowed in Feed
 * @return {FeedResponse} - The created Feed
 * @throws {403} - If the user is not logged in
 * @throws {400} - If isRecommendedEnabled is not true or false
 */
 router.put(
  '/',
  [
    userValidator.isUserLoggedIn,
    feedValidator.isFeedNotExists,
    feedValidator.isValidRecommendedEnabled
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const feed = await FeedCollection.updateOne(userId, req.body.isRecommendedEnabled);

    res.status(201).json({
      message: 'Your Feed was modified successfully.',
      feed: util.constructFeedResponse(feed)
    });
  }
);

/**
 * Delete the Feed of the current user.
 *
 * @name DELETE /api/feed
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or feed does not exist
 */
 router.delete(
    '/',
    [
      userValidator.isUserLoggedIn,
      feedValidator.isFeedNotExists
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
      await FeedCollection.deleteById(userId);
      res.status(200).json({
        message: 'Your Feed was deleted successfully.'
      });
    }
  );
  
export {router as feedRouter};
  