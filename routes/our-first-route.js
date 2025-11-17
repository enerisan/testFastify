/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */

async function routes(fastify, options) {

    const collection = fastify.mongo.db.collection('test_collection')
    fastify.get('/home', async (request, reply) => {

        return ('Hola qué tal');
    })

    fastify.get('/animals', async (request, reply) => {
        const result = await collection.find().toArray()
        if (result.length === 0) {
            throw new Error('No documents found. Funciona el error')
        }
        return result
    })

    fastify.get('/animals/:animal', async (request, reply) => {
        const result = await collection.findOne({animal: request.params.animal})
        if(!result) {
            throw new Error('Invalid value')
        }
        return result
    })

    const animalBodyJsonSchema =  {
        type: 'object',
        required:['animal'],
        properties:{
            animal: {type: 'string'},
        }
    }

    const schema = {
        body: animalBodyJsonSchema,
    }

    fastify.post('/animals', {schema}, async (request, reply)=> {
        const result = await collection.insertOne({animal: request.body.animal})
    })
}

export default routes;