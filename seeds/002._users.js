
exports.seed = function(knex) {
    return knex('roles').select().then(roles => {
      return knex('users').insert([   // password
        { username: 'admin', password: "$2b$12$3cfUKv7C6Bi33yiluNX1k.M/m.igSIg5hfQoGXyXWsayLXzzFq2Je", role_id: roles.find(role => role.role === 'ADMIN').id },
      ]);
    });
};
