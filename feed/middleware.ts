import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FeedCollection from './collection';

/**
 * Checks if Feed does not exist for the current user
 */
 const isFeedNotExists = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.userId;
    const feed = await FeedCollection.findByUserId(userId);
    if (!feed) {
      res.status(403).json({
        error: 'Feed does not exist.'
      });
      return;
    }
  
    next();
  };

/**
 * Checks if Feed does not exist for the current user
 */
 const isFeedAlreadyExists = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session.userId;
  const feed = await FeedCollection.findByUserId(userId);
  if (feed) {
    res.status(403).json({
      error: 'Feed already exists.'
    });
    return;
  }

  next();
};

const isValidRecommendedEnabled = (req: Request, res: Response, next: NextFunction) => {
  const isRecommendedEnabled = req.body.isRecommendedEnabled;
  if (isRecommendedEnabled !== 'true' && isRecommendedEnabled !== 'false') {
    res.status(400).json({
      error: 'isRecommendedEnabled must be true or false.'
    });
    return;
  }

  next();
};

export {
  isFeedNotExists,
  isFeedAlreadyExists,
  isValidRecommendedEnabled
};