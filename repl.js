var repl = require("repl").start({}),
    promisify = require("repl-promised").promisify,
    app = require('./app');
repl.context.models = app.get('bookshelf').models;
promisify(repl);
