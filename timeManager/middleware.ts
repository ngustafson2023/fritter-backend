import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import TimeManagerCollection from './collection';

/**
 * Checks if the milestone is a non-zero number
 */
const isValidMilestone = (req: Request, res: Response, next: NextFunction) => {
    const {milestone} = req.body as {milestone: string};
    const parsedMilestone = parseInt(milestone.trim());
    if (Number.isNaN(parsedMilestone)) {
      res.status(400).json({
        error: 'Milestone must be nonempty and numeric.'
      });
      return;
    }
  
    next();
  };

/**
 * Checks if the time limit is a non-zero number
 */
const isValidTimeLimit = (req: Request, res: Response, next: NextFunction) => {
    const {timeLimit} = req.body as {timeLimit: string};
    const parsedTimeLimit = parseInt(timeLimit.trim());
    if (Number.isNaN(parsedTimeLimit)) {
      res.status(400).json({
        error: 'Time limit must be nonempty and numeric.'
      });
      return;
    }
  
    next();
  };

/**
 * Checks if the current user is the creator of the Time Manager whose userId is in req.params
 */
 const isValidTimeManagerModifier = async (req: Request, res: Response, next: NextFunction) => {
    const timeManager = await TimeManagerCollection.findByUsername(req.params.username);
    const userId = timeManager.userId._id;
    if (req.session.userId !== userId.toString()) {
      res.status(403).json({
        error: 'Cannot modify other users\' Time Manager.'
      });
      return;
    }
  
    next();
  };
  
  export {
    isValidMilestone,
    isValidTimeLimit,
    isValidTimeManagerModifier
  };
  