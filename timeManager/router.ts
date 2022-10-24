import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import TimeManagerCollection from './collection';
import * as userValidator from '../user/middleware';
import * as timeManagerValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Modify a Time Manager.
 *
 * @name PUT /api/timemanagers
 *
 * @param {string} milestone
 * @param {string} timeLimit
 * @return {TimeManagerResponse} - The created Time Manager
 * @throws {403} - If the user is not logged in
 * @throws {400} - If milestone or time limit is non-numeric
 */
 router.put(
  '/',
  [
    userValidator.isUserLoggedIn,
    timeManagerValidator.isNumericMilestone,
    timeManagerValidator.isNumericTimeLimit,
    timeManagerValidator.isTimeManagerNotExists

  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const timeManager = await TimeManagerCollection.updateOne(userId, req.body);

    res.status(201).json({
      message: 'Your Time Manager was modified successfully.',
      timeManager: util.constructTimeManagerResponse(timeManager)
    });
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
      timeManagerValidator.isEmptyMilestone,
      timeManagerValidator.isEmptyTimeLimit,
      timeManagerValidator.isNumericMilestone,
      timeManagerValidator.isNumericTimeLimit,
      timeManagerValidator.isTimeManagerAlreadyExists

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
 * Delete the Time Manager for current user 
 *
 * @name DELETE /api/timemanagers
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or no Time Manager exists
 */
 router.delete(
    '/',
    [
      userValidator.isUserLoggedIn,
      timeManagerValidator.isTimeManagerNotExists
    ],
    async (req: Request, res: Response) => {
      await TimeManagerCollection.deleteById(req.session.userId);
      res.status(200).json({
        message: 'Your Time Manager was deleted successfully.'
      });
    }
  );
  
  export {router as timeManagerRouter};
  