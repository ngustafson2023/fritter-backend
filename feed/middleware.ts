import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FeedCollection from './collection';

/**
 * Checks if the current user is the creator of the Feed whose userId is in req.params
 */
 const isValidFeedModifier = async (req: Request, res: Response, next: NextFunction) => {
    const feed = await FeedCollection.findByUsername(req.params.username);
    const userId = feed.userId._id;
    if (req.session.userId !== userId.toString()) {
      res.status(403).json({
        error: 'Cannot modify other users\' Feed.'
      });
      return;
    }
  
    next();
  };

  export {
    isValidFeedModifier
  };