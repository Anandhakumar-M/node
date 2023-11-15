const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userPermissionsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'user', 'doctor'],
    default:'user'
  },
  module: {
    type: String,
    enum: ['*', 'animal', 'milk', 'feed', 'bread'],
    required: true,
  },
  permissions: {
    read:{type:Boolean,
      default: false},
    write: {type:Boolean,
      default: false},
    delete:{type:Boolean,
      default: false},
    update: {type:Boolean,
      default: false},
  },
});

const UserPermissions = mongoose.model('UserPermissions', userPermissionsSchema);

module.exports = UserPermissions;
