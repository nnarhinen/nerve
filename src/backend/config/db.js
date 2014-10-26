module.exports = {
  //TODO production configs
  development: {
    client: 'sqlite',
    connection: {
      filename: './development.sqlite'
    }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  },
  test: {
    client: 'sqlite',
    connection: {
      filename: './test.sqlite'
    }
  }
};

// Use postrgres in development if variable set
if (process.env.DATABASE_URL && process.env.NODE_ENV !== 'test') {
  module.exports.development = {
    client: 'pg',
    connection: process.env.DATABASE_URL
  };
}
