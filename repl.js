var repl = require("repl").start({}),
    promisify = require("repl-promised").promisify,
    app = require('./src/backend/app');
repl.context.models = app.get('bookshelf').models;
promisify(repl);
