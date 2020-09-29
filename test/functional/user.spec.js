const { test, trait } = use('Test/Suite')('User');
/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
/** @type {import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');
const Helpers = use('Helpers');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

test('It should be able to update avatar', async ({ assert, client }) => {

    const user = await Factory.model('App/Models/User').create();

    const response = await client 
        .put('/profile')
        .loginVia(user, 'jwt')
        .attach('avatar', Helpers.tmpPath('test/avatar_git.jpg'))
        .end();

    response.assertStatus(200);
    assert.exists(response.body.avatar);
});