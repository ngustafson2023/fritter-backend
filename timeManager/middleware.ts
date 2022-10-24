import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import TimeManagerCollection from './collection';

/**
 * Checks if the milestone is empty
 */
 const isEmptyMilestone = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.milestone) {
    res.status(400).json({
      error: 'Milestone must be nonempty.'
    });
    return;
  }

  next();
};

/**
 * Checks if the time limit is empty
 */
 const isEmptyTimeLimit = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.timeLimit) {
    res.status(400).json({
      error: 'Time Limit must be nonempty.'
    });
    return;
  }

  next();
};

/**
 * Checks if the milestone is numeric
 */
const isNumericMilestone = (req: Request, res: Response, next: NextFunction) => {
    const milestone = req.body.milestone as string;
    const parsedMilestone = parseInt(milestone.trim());
    if (milestone !== '' && Number.isNaN(parsedMilestone)) {
      res.status(400).json({
        error: 'Milestone must be numeric.'
      });
      return;
    }
  
    next();
  };

/**
 * Checks if the time limit is numeric
 */
const isNumericTimeLimit = (req: Request, res: Response, next: NextFunction) => {
    const timeLimit = req.body.timeLimit as string;
    const parsedTimeLimit = parseInt(timeLimit.trim());
    if (timeLimit !== '' && Number.isNaN(parsedTimeLimit)) {
      res.status(400).json({
        error: 'Time limit must be numeric.'
      });
      return;
    }
  
    next();
  };

/**
 * Checks if a Time Manager already exists for the current user
 */
 const isTimeManagerAlreadyExists = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session.userId;
    const timeManager = await TimeManagerCollection.findByUserId(userId);
    if (timeManager) {
      res.status(403).json({
        error: 'Time Manager already exists.'
      });
      return;
    }
  
    next();
  };

/**
 * Checks if Time Manager does not exist for the current user
 */
 const isTimeManagerNotExists = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session.userId;
    const timeManager = await TimeManagerCollection.findByUserId(userId);
    if (!timeManager) {
      res.status(403).json({
        error: 'Time Manager does not exist.'
      });
      return;
    }
  
    next();
  };
  
  export {
    isEmptyMilestone,
    isEmptyTimeLimit,
    isNumericMilestone,
    isNumericTimeLimit,
    isTimeManagerAlreadyExists,
    isTimeManagerNotExists
  };
  