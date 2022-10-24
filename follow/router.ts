import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FollowCollection from './collection';
import * as userValidator from '../user/middleware';
import * as util from './util';
import * as followValidator from './middleware';

const router = express.Router();

/**
 * Get all the Follows
 *
 * @name GET /api/follows
 *
 * @return {FollowResponse[]} - A list of all the Follows sorted in descending
 *                      order by date created
 */
/**
 * Get all Follows for a given user.
 *
 * @name GET /api/follows?username=id
 *
 * @return {FollowResponse[]} - An array of Follows created by user with username id
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
  
      const allFollows = await FollowCollection.findAll();
      const response = allFollows.map(util.constructFollowResponse);
      res.status(200).json(response);
    },
    [
      userValidator.isUserExists
    ],
    async (req: Request, res: Response) => {
      const userFollows = await FollowCollection.findAllByUsername(req.query.username as string);
      const response = userFollows.map(util.constructFollowResponse);
      res.status(200).json(response);
    }
  );
  
  /**
   * Create a new Follow.
   *
   * @name POST /api/follows/:username
   *
   * @return {FollowResponse} - The created Follow
   * @throws {403} - If the user is not logged in
   * @throws {403} - If the Follow already exists
   * @throws {404} - If no user has given username
   */
  router.post(
    '/:username',
    [
      userValidator.isUserLoggedIn,
      userValidator.isValidFollowing,
      followValidator.isFollowAlreadyExists
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
      const follow = await FollowCollection.addOne(userId, req.params.username);
  
      res.status(201).json({
        message: 'Your Follow was created successfully.',
        follow: util.constructFollowResponse(follow)
      });
    }
  );
  
  /**
   * Delete a Follow
   *
   * @name DELETE /api/follows/:username
   *
   * @return {string} - A success message
   * @throws {403} - If the user is not logged in
   * @throws {404} - If the Follow does not exist
   */
  router.delete(
    '/:username',
    [
      userValidator.isUserLoggedIn,
      userValidator.isValidFollowing,
      followValidator.isFollowNotExists
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
      await FollowCollection.deleteByUsernames(userId, req.params.username);
      
      res.status(200).json({
        message: 'Your Follow was deleted successfully.'
      });
    }
  );
  
  export {router as followRouter};
  