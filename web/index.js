import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';

export const webUI = fastify();

export const setupWebUI = () => {
    webUI.register(fastifyStatic, {
        root: path.resolve('web'),
        prefix: '/',
    });

    webUI.listen({
        host: '0.0.0.0',
        port: 80
    }, (err, address) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`WebUI listening on ${address}`);
    });
}
