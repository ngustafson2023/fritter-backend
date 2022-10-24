import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import { User } from '../user/model';

/**
 * This file defines the properties stored in a Feed
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Feed on the backend
export type Feed = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    userId: Types.ObjectId;
    isRecommendedEnabled: boolean;
};

export type PopulatedFeed = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    userId: User;
    isRecommendedEnabled: boolean;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Feeds stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FeedSchema = new Schema<Feed>({
    // The userId
    userId: {
      // Use Types.ObjectId outside of the schema
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    // Whether recommended content is allowed in Feed
    isRecommendedEnabled: {
      type: Boolean,
      required: true
    }
});
  
const FeedModel = model<Feed>('Feed', FeedSchema);
export default FeedModel;
  