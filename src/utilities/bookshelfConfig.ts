import Bookshelf from 'bookshelf';
import Knex from 'knex';
const config = require('../../knexfile');

const knex = Knex(config.development);

const bookshelf = Bookshelf(knex);

bookshelf.plugin('bookshelf-virtuals-plugin');

export default bookshelf;