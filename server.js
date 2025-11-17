
// Require the framework and instantiate it 
import Fastify from 'fastify';
import routes from './routes/our-first-route.js';
import dbConnector from './our-db-connector.js'

const fastify = Fastify({
    logger: true
})

// Declare a route
fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
})

// Registre plugin routes
fastify.register(dbConnector)
fastify.register(routes);
const start = async () => {
    try {
        await fastify.listen({ port: 3000 })

    } catch (err) {
        fastify.log.error(err)
        process.exit(1);
    }
}

start();

