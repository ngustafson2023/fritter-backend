import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FollowCollection from './collection';
import UserCollection from '../user/collection';

/**
 * Checks if a Follow with followId in req.params exists
 */
 const isFollowAlreadyExists = async (req: Request, res: Response, next: NextFunction) => {
  const followingId = await UserCollection.findOneByUsername(req.params.username);
  const follow = await FollowCollection.findOneByIds(req.session.userId, followingId._id);
  if (follow) {
    res.status(403).json({
      error: {
        freetNotFound: `Follow with ${req.params.username} already exists.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a Follow with username in req.params exists
 */
const isFollowNotExists = async (req: Request, res: Response, next: NextFunction) => {
  const followingId = await UserCollection.findOneByUsername(req.params.username);
  const follow = await FollowCollection.findOneByIds(req.session.userId, followingId._id);
  if (!follow) {
    res.status(404).json({
      error: {
        followNotFound: `Follow with ${req.params.username} does not exist.`
      }
    });
    return;
  }

  next();
};
  
export {
  isFollowAlreadyExists,
  isFollowNotExists
};
  