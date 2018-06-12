import { Mongo } from 'meteor/mongo';
 
export const savedText = new Mongo.Collection('saved-text');