import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Follow, PopulatedFollow} from './model';

// Update this if you add a property to the Follow type!
type FollowResponse = {
    _id: string;
    followerId: string;
    followingId: string;
    dateCreated: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Follow object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Freet>} follow - A Follow
 * @returns {FollowResponse} - The Follow object formatted for the frontend
 */
 const constructFollowResponse = (follow: HydratedDocument<Follow>): FollowResponse => {
    const followCopy: PopulatedFollow = {
      ...follow.toObject({
        versionKey: false // Cosmetics; prevents returning of __v property
      })
    };
    const followerId = followCopy.followerId.username;
    delete followCopy.followerId;
    const followingId = followCopy.followingId.username;
    delete followCopy.followingId;
    return {
      ...followCopy,
      _id: followCopy._id.toString(),
      followerId: followerId,
      followingId: followingId,
      dateCreated: formatDate(follow.dateCreated),
    };
  };
  
  export {
    constructFollowResponse
  };
  