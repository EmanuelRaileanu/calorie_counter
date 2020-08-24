import bookshelf from './bookshelfConfig';

async function clearUsersFoods(){
    await bookshelf.knex('users_foods').where('userId', '>', '0').del();
};

export default clearUsersFoods;