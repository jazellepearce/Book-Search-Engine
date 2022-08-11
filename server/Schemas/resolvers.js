const User = require ("../models/User")
// Resolvers define the technique for fetching the types defined in the

// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
      books: async() => {
        const books = await Books.find({})
        return books;
      },
      user: async() => { const foundUser = await User.findOne({
        $or: [{ _id: params.id }, { username: params.username }],
      });
    return foundUser
    }
    },
  };
  module.exports = resolvers;