import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import { User } from '../user/model';

/**
 * This file defines the properties stored in a User
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for TimeManager on the backend
export type TimeManager = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    userId: Types.ObjectId;
    milestone: number;
    timeLimit: number;
}

export type PopulatedTimeManager = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    userId: User;
    milestone: number;
    timeLimit: number;
}

// Mongoose schema definition for interfacing with a MongoDB table
// TimeManagers stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const TimeManagerSchema = new Schema<TimeManager>({
  // The userId
  userId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The milestone
  milestone: {
    type: Number,
    required: true
  },
  // The time limit
  timeLimit: {
    type: Number,
    required: true
  }
});

const TimeManagerModel = model<TimeManager>('TimeManager', TimeManagerSchema);
export default TimeManagerModel;
