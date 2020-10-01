const { test, trait } = use('Test/Suite')('User');
/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
/** @type {import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');
const Helpers = use('Helpers');
const Hash = use('Hash');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

test('It should be able to update Profile', async ({ assert, client }) => {

    const user = await Factory.model('App/Models/User').create({
        username: 'Tiago',
        password: '123123',
    });
    
    const response = await client 
        .put('/profile')
        .loginVia(user, 'jwt')
        .field('username', 'Jorge')
        .field('password', '123456')
        .field('password_confirmation', '123456')
        .attach('avatar', Helpers.tmpPath('test/avatar_git.jpg'))
        .end();

        //console.log(response);
    
    response.assertStatus(200);

    assert.exists(response.body.avatar);
    await user.reload();    
    assert.isTrue(await Hash.verify('123456', user.password));
    assert.equal(response.body.username, 'Jorge');
    
});