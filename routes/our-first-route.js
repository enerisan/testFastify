/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */

import { ObjectId } from "@fastify/mongodb";


const animalBodyJsonSchema = {
    type: 'object',
    required: ['animal'],
    properties: {
        id: { type: 'integer' },
        animal: { type: 'string' },
        speed: { type: 'string' }

    }
}

const schema = {
    body: animalBodyJsonSchema,
}

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

    fastify.get('/animals/name/:animal', async (request, reply) => {
        const result = await collection.findOne({ animal: request.params.animal })
        if (!result) {
            throw new Error('Invalid value')
        }
        return result
    })

    fastify.get('/animals/id/:animalId', async (request, reply) => {
        const { ObjectId } = fastify.mongo
        const { animalId } = request.params

        let objectId
        try {
            objectId = new ObjectId(animalId)
        } catch (e) {
            throw new Error('Invalid value')
        }
        const result = await collection.findOne({ _id: objectId })

        if (!result) {
            throw new Error('Invalid value')
        }

        return result

    })



    fastify.post('/animals', { schema }, async (request, reply) => {
        const { animal, speed } = request.body
        const result = await collection.insertOne({ animal, speed })
        return { insertedId: result.insertedId }
    })

    fastify.put('/animals/name/:animal', async (request, reply) => {
        const oldAnimalName = request.params.animal;
        const { animal, speed } = request.body;
        const result = await collection.updateOne(
            { animal: oldAnimalName },
            {
                $set: {
                    animal,
                    speed
                }
            }
        )

        if (result.matchedCount === 0) {
            throw new Error('Animal not found')
        }

        const updatedAnimal = await collection.findOne({ animal })

        return updatedAnimal;
    })

    fastify.put('/animals/id/:animalId', async (request, reply) => {
        const { ObjectId } = fastify.mongo
        const objectId = new ObjectId(request.params.animalId)
        const { animal, speed } = request.body;
        const result = await collection.updateOne(
            { _id: objectId },
            {
                $set: {
                    animal,
                    speed
                }
            }
        )
        if (result.matchedCount === 0) {
            throw new Error('Animal not found')
        }

        const updatedAnimal = await collection.findOne({ _id: objectId })
        return updatedAnimal;
    })

    fastify.delete('/animals/id/:animalId', async (request, reply) => {
        const { ObjectId } = fastify.mongo
        let objectId;
        try {
            objectId = new ObjectId(request.params.animalId)

        } catch (e) {
            reply.code(400)
            return { error: 'Invalid animalId' }
        }


        try {

            const result = await collection.deleteOne({ _id: objectId })

            if (result.deletedCount === 0) {
                reply.code(404)
                return { error: 'Animal not found' }
            }
            return { success: true, deletedId: request.params.animalId }

        } catch (e) {
            reply.code(500)
            return { error: 'Internal server error' }
        }
    })
}

export default routes;