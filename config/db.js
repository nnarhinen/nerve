module.exports = {
  //TODO production configs
  development: {
    client: 'sqlite',
    connection: {
      filename: './development.sqlite'
    }
  }
};

// Use postrgres in development if variable set
if (process.env.DATABASE_URL) {
  module.exports.development = {
    client: 'pg',
    connection: process.env.DATABASE_URL
  };
}
