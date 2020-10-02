'use strict'


/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {import('@adonisjs/lucid/src/Lucid/Model')} */
const Workshop = use('App/Models/Workshop');

/**
 * Resourceful controller for interacting with workshops
 */
class WorkshopController {
  /**
   * Show a list of all workshops.
   * GET workshops
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    const section = request.input('section', 1);

    const workshop = await Workshop
      .query()
      .where('section', section)
      .with('user', builder => {
        builder.select(['id', 'username', 'avatar']);
      })
      .fetch();

    return workshop;
  }

  /**
   * Render a form to be used for creating a new workshop.
   * GET workshops/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new workshop.
   * POST workshops
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const data = request.only([
      'title',
      'description',
      'user_id',
      'section',
      'color',
    ]);

    const workshop = await Workshop.create(data);

    return response.status(201).json(workshop);
  }
  
  /**
   * Display a single workshop.
   * GET workshops/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    const workshop = await Workshop.find(params.id);

    //linha abaixo é devido ter relacionamento.
    await workshop.load('user', builder => {
      builder.select(['id', 'username', 'avatar']);
    });

    return workshop;
  }

  /**
   * Render a form to update an existing workshop.
   * GET workshops/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update workshop details.
   * PUT or PATCH workshops/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const data = request.only([
      'title',
      'description',
      'user_id',
      'section',
      'color',
    ]);

    const workshop = await Workshop.find(params.id);

    workshop.merge(data);

    await workshop.save();

    return workshop;
  }

  /**
   * Delete a workshop with id.
   * DELETE workshops/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const workshop = await Workshop.find(params.id);

    await workshop.delete();    
  }
}

module.exports = WorkshopController
