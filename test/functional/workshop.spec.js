const { test, trait } = use('Test/Suite')('Workshop');
/** @type {import('@adonisjs/lucid/src/Factory')} */
/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
/** @type {import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

test('It should be able to create workshops', async ({ assert, client }) => {
    const user = await Factory.model('App/Models/User').create();

    const response = await client 
        .post('/workshops')
        .loginVia(user, 'jwt')
        .send({
            user_id: user.id,
            section: 1,
            title: 'Texto para um titulo qualquer...',
            description: 'Descrição para um workshop do instrutor vinculado.',
        })
        .end()

    response.assertStatus(201);
    assert.exists(response.body.id);
});

test('It should be able to list workshops', async ({ assert, client }) => {
    const user = await Factory.model('App/Models/User').create();
    const workshop = await Factory.model('App/Models/Workshop').make();

    await user.workshops().save(workshop);

    const response = await client
        .get('/workshops')
        .loginVia(user, 'jwt')
        .end();


    response.assertStatus(200);
    assert.equal(response.body[0].title, workshop.title);
    assert.equal(response.body[0].user.id, user.id);
});

test('It should be able to show single workshops', async ({ assert, client }) => {
    const user = await Factory.model('App/Models/User').create();
    const workshop = await Factory.model('App/Models/Workshop').create();

    await user.workshops().save(workshop);

    const response = await client
        .get(`/workshops/${workshop.id}`)
        .loginVia(user, 'jwt')
        .end();


    response.assertStatus(200);
    assert.equal(response.body.title, workshop.title);
    assert.equal(response.body.user.id, user.id);
});