import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FeedCollection from './collection';
import * as userValidator from '../user/middleware';
import * as feedValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the Feeds
 *
 * @name GET /api/feeds
 *
 * @return {FeedResponse[]} - A list of all the Feeds
 */
/**
 * Get a Feed by user
 *
 * @name GET /api/feeds?username=id
 *
 * @return {FeedResponse} 
 * @throws {400} - If username is not given
 * @throws {404} - If no user has given username
 *
 */
router.get(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
      // Check if username query parameter was supplied
      if (req.query.username !== undefined) {
        next();
        return;
      }
  
      const allFeeds = await FeedCollection.findAll();
      const response = allFeeds.map(util.constructFeedResponse);
      res.status(200).json(response);
    },
    [
      userValidator.isUsernameExists
    ],
    async (req: Request, res: Response) => {
      const feed = await FeedCollection.findByUsername(req.query.username as string);
      const response = util.constructFeedResponse(feed);
      res.status(200).json(response);
    }
);

/**
 * Create a new Feed.
 *
 * @name POST /api/feeds
 *
 * @param {boolean} isRecommendedEnabled - Whether recommended content is allowed in Feed
 * @return {FeedResponse} - The created Feed
 * @throws {403} - If the user is not logged in
 */
router.post(
    '/',
    [
      userValidator.isUserLoggedIn
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
 * Delete the Feed for given user 
 *
 * @name DELETE /api/feeds/:username
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the creator of
 *                 the Feed
 * @throws {404} - If the username is not valid
 */
 router.delete(
    '/:username?',
    [
      userValidator.isUserLoggedIn,
      userValidator.isUsernameExists,
      feedValidator.isValidFeedModifier
    ],
    async (req: Request, res: Response) => {
      await FeedCollection.deleteByUsername(req.params.username);
      res.status(200).json({
        message: 'Your Feed was deleted successfully.'
      });
    }
  );
  
  export {router as feedRouter};
  