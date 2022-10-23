import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FollowCollection from './collection';

/**
 * Checks if a Follow with followId in req.params exists
 */
const isFollowExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.followId);
  const follow = validFormat ? await FollowCollection.findOne(req.params.followId) : '';
  if (!follow) {
    res.status(404).json({
      error: {
        freetNotFound: `Follow with follow ID ${req.params.followId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the creator of the Follow whose followId is in req.params
 */
const isValidFollowModifier = async (req: Request, res: Response, next: NextFunction) => {
    const freet = await FollowCollection.findOne(req.params.followId);
    const userId = freet.followerId._id;
    if (req.session.userId !== userId.toString()) {
      res.status(403).json({
        error: 'Cannot modify other users\' Follows.'
      });
      return;
    }
  
    next();
};
  
export {
    isFollowExists,
    isValidFollowModifier
};
  