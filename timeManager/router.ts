import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import TimeManagerCollection from './collection';
import * as userValidator from '../user/middleware';
import * as timeManagerValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the Time Managers
 *
 * @name GET /api/timemanagers
 *
 * @return {TimeManagerResponse[]} - A list of all the Time Managers
 */
/**
 * Get a Time Manager by user
 *
 * @name GET /api/timemanagers?username=id
 *
 * @return {TimeManagerResponse} 
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
  
      const allTimeManagers = await TimeManagerCollection.findAll();
      const response = allTimeManagers.map(util.constructTimeManagerResponse);
      res.status(200).json(response);
    },
    [
      userValidator.isUsernameExists
    ],
    async (req: Request, res: Response) => {
      const timeManager = await TimeManagerCollection.findByUsername(req.query.username as string);
      const response = util.constructTimeManagerResponse(timeManager);
      res.status(200).json(response);
    }
);

/**
 * Create a new Time Manager.
 *
 * @name POST /api/timemanagers
 *
 * @param {string} milestone
 * @param {string} timeLimit
 * @return {TimeManagerResponse} - The created Time Manager
 * @throws {403} - If the user is not logged in
 * @throws {400} - If milestone is empty or non-numeric
 * @throws {400} - If time limit is empty or non-numeric
 */
router.post(
    '/',
    [
      userValidator.isUserLoggedIn,
      timeManagerValidator.isValidMilestone,
      timeManagerValidator.isValidTimeLimit

    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
      const timeManager = await TimeManagerCollection.addOne(userId, parseInt(req.body.milestone), parseInt(req.body.timeLimit));
  
      res.status(201).json({
        message: 'Your Time Manager was created successfully.',
        timeManager: util.constructTimeManagerResponse(timeManager)
      });
    }
);

/**
 * Delete the Time Manager for given user 
 *
 * @name DELETE /api/timemanagers/:username
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the creator of
 *                 the Time Manager
 * @throws {404} - If the username is not valid
 */
 router.delete(
    '/:username?',
    [
      userValidator.isUserLoggedIn,
      timeManagerValidator.isValidTimeManagerModifier
    ],
    async (req: Request, res: Response) => {
      await TimeManagerCollection.deleteByUsername(req.params.username);
      res.status(200).json({
        message: 'Your Time Manager was deleted successfully.'
      });
    }
  );
  
  export {router as timeManagerRouter};
  