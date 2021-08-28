'use strict';

const Hapi = require('@hapi/hapi');
const appRoot = require('app-root-path');
const routes = require(appRoot+'/routes');

const init = async () => {

    const server = Hapi.server({
        port: 5000,
        host: 'localhost'
    });

    // Get all routes from external route file
    routes.map(route=>{
        server.route(route);
    });

    server.route({
        method: 'GET',
        path:'/health',
        handler: (request, h) => {
            return 'Hello i am working fine!';
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();