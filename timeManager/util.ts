import type {HydratedDocument} from 'mongoose';
import type {TimeManager, PopulatedTimeManager} from './model';

// Update this if you add a property to the Freet type!
type TimeManagerResponse = {
  _id: string;
  userId: string;
  milestone: string;
  timeLimit: string;
};

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Freet>} freet - A freet
 * @returns {FreetResponse} - The freet object formatted for the frontend
 */
 const constructTimeManagerResponse = (timeManager: HydratedDocument<TimeManager>): TimeManagerResponse => {
    const timeManagerCopy: PopulatedTimeManager = {
      ...timeManager.toObject({
        versionKey: false // Cosmetics; prevents returning of __v property
      })
    };
    const {username} = timeManagerCopy.userId;
    delete timeManagerCopy.userId;
    return {
      ...timeManagerCopy,
      _id: timeManagerCopy._id.toString(),
      userId: username,
      milestone: timeManagerCopy.milestone.toString(),
      timeLimit: timeManagerCopy.timeLimit.toString()
    };
  };
  
  export {
    constructTimeManagerResponse
  };
  