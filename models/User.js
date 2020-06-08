const { Model } = require('objection');

const Role = require('./Role.js');

class User extends Model {
    static tableName = 'users';

    static relationMappings = {
        role: {
          relation: Model.BelongsToOneRelation,
          modelClass: Role,
          join: {
            from: 'users.roleId',
            to: 'roles.id'
          }
        }
    };
}

module.exports = User;