import type {HydratedDocument, Types} from 'mongoose';
import type {Feed} from './model';
import FeedModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore Feeds
 * stored in MongoDB, including adding, finding, and deleting Feeds.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class FeedCollection {
  /**
   * Add a Feed to the collection
   *
   * @param {string} userId - The id of the user
   * @param {boolean} isRecommendedEnabled - Whether recommended content is allowed in Feed
   * @return {Promise<HydratedDocument<Feed>>} - The newly created Feed
   */
  static async addOne(userId: Types.ObjectId | string, isRecommendedEnabled: boolean): Promise<HydratedDocument<Feed>> {
    const feed = new FeedModel({
        userId,
        isRecommendedEnabled
    });
    await feed.save(); // Saves freet to MongoDB
    return feed.populate('userId');
  }

  /**
   * Modify a Feed
   *
   * @param {string} userId - The id of the user
   * @param {Object} feedDetails - An object with the user's updated preferences
   * @return {Promise<HydratedDocument<TimeManager>>} - The newly modified TimeManager
   */
  static async updateOne(userId: Types.ObjectId | string, feedDetails: any): Promise<HydratedDocument<Feed>> {
    const isRecommendedEnabled = feedDetails.isRecommendedEnabled;
    const feed = await FeedCollection.findByUserId(userId);
    if (isRecommendedEnabled === 'true') {
      feed.isRecommendedEnabled = true;
    } else {  // isRecommendedEnabled === 'false'
      feed.isRecommendedEnabled = false;
    }
    
    await feed.save(); // Saves freet to MongoDB
    return feed.populate('userId');
  }

  /**
   * Find a Feed by feedId
   *
   * @param {string} feedId - The id of the Feed to find
   * @return {Promise<HydratedDocument<Feed>> | Promise<null> } - The Feed with the given feedId, if any
   */
  static async findOne(feedId: Types.ObjectId | string): Promise<HydratedDocument<Feed>> {
    return FeedModel.findOne({_id: feedId}).populate('userId');
  }

  /**
   * Get all the Feeds in the database
   *
   * @return {Promise<HydratedDocument<Feed>[]>} - An array of all of the Feeds
   */
  static async findAll(): Promise<Array<HydratedDocument<Feed>>> {
    return FeedModel.find({}).populate('userId');
  }

  /**
   * Get the Feed for a given user
   *
   * @param {string} username - The username of user
   * @return {Promise<HydratedDocument<Feed>>}
   */
  static async findByUsername(username: string): Promise<HydratedDocument<Feed>> {
    const user = await UserCollection.findOneByUsername(username);
    return FeedModel.findOne({userId: user._id}).populate('userId');
  }

  /**
   * Find a Feed by userId
   *
   * @param {string} userId - The userId of the Feed to find
   * @return {Promise<HydratedDocument<Feed>> | Promise<null> } - The Feed with the given userId, if any
   */
  static async findByUserId(userId: Types.ObjectId | string): Promise<HydratedDocument<Feed>> {
    return FeedModel.findOne({userId: userId}).populate('userId');
}

  /**
   * Delete a Feed with given feedId
   *
   * @param {string} feedId - The feedId of Feed to delete
   * @return {Promise<boolean>} - true if the Feed has been deleted, false otherwise
   */
  static async deleteOne(feedId: Types.ObjectId | string): Promise<boolean> {
    const feed = await FeedModel.deleteOne({_id: feedId});
    return feed !== null;
  }

  /**
   * Delete the Feed of the user with id userId
   * @param {string} userId - The id of the user 
   * @returns {Promise<boolean>} - true if the Feed has been deleted, false otherwise
   */
  static async deleteById(userId: Types.ObjectId | string): Promise<boolean> {
    const feed = await FeedModel.deleteOne({userId: userId});
    return feed !== null;
  }

    /**
     * Delete the Feed of a given user
     *
     * @param {string} username - The username of user
     */
    static async deleteByUsername(username: string): Promise<void> {
        const user = await UserCollection.findOneByUsername(username);
        await FeedModel.deleteOne({userId: user._id});
    }
}

export default FeedCollection;
