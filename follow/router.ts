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
 * Get Follows by user.
 *
 * @name GET /api/follows?followerId=id
 *
 * @return {FollowResponse[]} - An array of Follows created by user with followerId
 * @throws {400} - If followerId is not given
 * @throws {404} - If no user has given followerId
 *
 */
 router.get(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
      // Check if followerId query parameter was supplied
      if (req.query.follower !== undefined) {
        next();
        return;
      }
  
      const allFollows = await FollowCollection.findAll();
      const response = allFollows.map(util.constructFollowResponse);
      res.status(200).json(response);
    },
    [
      userValidator.isFollowerExists
    ],
    async (req: Request, res: Response) => {
      const followerFreets = await FollowCollection.findAllByUsername(req.query.follower as string);
      const response = followerFreets.map(util.constructFollowResponse);
      res.status(200).json(response);
    }
  );
  
  /**
   * Create a new Follow.
   *
   * @name POST /api/follows
   *
   * @param {string} following - The username of the user being followed
   * @return {FollowResponse} - The created Follow
   * @throws {403} - If the user is not logged in
   * @throws {404} - If no user has given followingId
   */
  router.post(
    '/',
    [
      userValidator.isUserLoggedIn,
      userValidator.isValidFollowing
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
      const follow = await FollowCollection.addOne(userId, req.body.following);
  
      res.status(201).json({
        message: 'Your Follow was created successfully.',
        follow: util.constructFollowResponse(follow)
      });
    }
  );
  
  /**
   * Delete a Follow
   *
   * @name DELETE /api/follows/:id
   *
   * @return {string} - A success message
   * @throws {403} - If the user is not logged in or is not the creator of
   *                 the Follow
   * @throws {404} - If the followId is not valid
   */
  router.delete(
    '/:followId?',
    [
      userValidator.isUserLoggedIn,
      followValidator.isFollowExists,
      followValidator.isValidFollowModifier
    ],
    async (req: Request, res: Response) => {
      await FollowCollection.deleteOne(req.params.followId);
      res.status(200).json({
        message: 'Your Follow was deleted successfully.'
      });
    }
  );
  
  export {router as followRouter};
  