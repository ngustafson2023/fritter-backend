import type {HydratedDocument} from 'mongoose';
import type {Feed, PopulatedFeed} from './model';

// Update this if you add a property to the Feed type!
type FeedResponse = {
  _id: string;
  userId: string;
  isRecommendedEnabled: boolean;
};

/**
 * Transform a raw Feed object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Feed>} feed - A feed
 * @returns {FeedResponse} - The feed object formatted for the frontend
 */
 const constructFeedResponse = (feed: HydratedDocument<Feed>): FeedResponse => {
    const feedCopy: PopulatedFeed = {
      ...feed.toObject({
        versionKey: false // Cosmetics; prevents returning of __v property
      })
    };
    const {username} = feedCopy.userId;
    delete feedCopy.userId;
    return {
      ...feedCopy,
      _id: feedCopy._id.toString(),
      userId: username,
      isRecommendedEnabled: feedCopy.isRecommendedEnabled
    };
  };
  
  export {
    constructFeedResponse
  };
  