
exports.seed = function(knex) {
  return knex('users').del()
    .then(() => {
      return knex('roles').del();
    });
};
