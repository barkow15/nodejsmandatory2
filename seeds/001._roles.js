
exports.seed = function(knex) {
    // Inserts seed entries
    return knex('roles').insert([
      { role: 'ADMIN' },
      { role: 'USER' },
      { role: 'ANONYMOUS' }
    ]);
};
