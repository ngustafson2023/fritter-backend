import type {HydratedDocument, Types} from 'mongoose';
import type {TimeManager} from './model';
import TimeManagerModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore TimeManagers
 * stored in MongoDB, including adding, finding, updating, and deleting them.
 * Feel free to add additional operations in this file.
 *
 */
 class TimeManagerCollection {
    /**
     * Add a TimeManager to the collection
     *
     * @param {string} userId - The id of the user
     * @param {number} milestone - The milestone
     * @param {number} timeLimit - The time limit
     * @return {Promise<HydratedDocument<TimeManager>>} - The newly created TimeManager
     */
    static async addOne(userId: Types.ObjectId | string, milestone: number, timeLimit: number): Promise<HydratedDocument<TimeManager>> {
        const timeManager = new TimeManagerModel({
            userId,
            milestone,
            timeLimit
        });
        await timeManager.save(); // Saves freet to MongoDB
        return timeManager.populate('userId');
    }

    /**
     * Modify a TimeManager
     *
     * @param {string} userId - The id of the user
     * @param {Object} timeManagerDetails - An object with the user's updated preferences
     * @return {Promise<HydratedDocument<TimeManager>>} - The newly modified TimeManager
     */
     static async updateOne(userId: Types.ObjectId | string, timeManagerDetails: any): Promise<HydratedDocument<TimeManager>> {
        const timeManager = await TimeManagerCollection.findByUserId(userId);
        if (timeManagerDetails.milestone) {
            timeManager.milestone = parseInt(timeManagerDetails.milestone);
        }
        if (timeManagerDetails.timeLimit) {
            timeManager.timeLimit = parseInt(timeManagerDetails.timeLimit);
        }
        await timeManager.save(); // Saves freet to MongoDB
        return timeManager.populate('userId');
    }


    /**
     * Find a TimeManager by timeManagerId
     *
     * @param {string} timeManagerId - The id of the TimeManager to find
     * @return {Promise<HydratedDocument<TimeManager>> | Promise<null> } - The freet with the given freetId, if any
     */
    static async findOne(timeManagerId: Types.ObjectId | string): Promise<HydratedDocument<TimeManager>> {
        return TimeManagerModel.findOne({_id: timeManagerId}).populate('userId');
    }

    /**
     * Find a TimeManager by userId
     *
     * @param {string} userId - The userId of the TimeManager to find
     * @return {Promise<HydratedDocument<TimeManager>> | Promise<null> } - The TimeManager with the given userId, if any
     */
     static async findByUserId(userId: Types.ObjectId | string): Promise<HydratedDocument<TimeManager>> {
        return TimeManagerModel.findOne({userId: userId}).populate('userId');
    }

    /**
     * Get all the TimeManagers in the database
     *
     * @return {Promise<HydratedDocument<TimeManager>[]>} - An array of all of the TimeManagers
     */
    static async findAll(): Promise<Array<HydratedDocument<TimeManager>>> {
        return TimeManagerModel.find({}).populate('userId');
    }

    /**
     * Get Time Manager for a given user
     *
     * @param {string} username - The username of user
     * @return {Promise<HydratedDocument<Freet>>}
     */
    static async findByUsername(username: string): Promise<HydratedDocument<TimeManager>> {
        const user = await UserCollection.findOneByUsername(username);
        return TimeManagerModel.findOne({userId: user._id}).populate('userId');
    }

    /**
     * Delete a Time Manager with given timeManagerId.
     *
     * @param {string} timeManagerId - The timeManagerId of Time Manager to delete
     * @return {Promise<Boolean>} - true if the Time Manager has been deleted, false otherwise
     */
    static async deleteOne(timeManagerId: Types.ObjectId | string): Promise<boolean> {
        const timeManager = await TimeManagerModel.deleteOne({_id: timeManagerId});
        return timeManager !== null;
    }

    /**
     * Delete the Time Manager of a given user by userId
     *
     * @param {string} userId - The id of user
     */
     static async deleteById(userId: Types.ObjectId | string): Promise<void> {
        await TimeManagerModel.deleteOne({userId: userId});
    }
    
    /**
     * Delete the Time Manager of a given user by username
     *
     * @param {string} username - The username of user
     */
    static async deleteByUsername(username: string): Promise<void> {
        const user = await UserCollection.findOneByUsername(username);
        await TimeManagerModel.deleteOne({userId: user._id});
    }

}

export default TimeManagerCollection;