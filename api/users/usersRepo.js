module.exports.name = 'usersRepo'
module.exports.dependencies = ['db', 'User', 'polyn']
module.exports.factory = (db, User, { Blueprint, is }) => {
  const collection = db.collection(User.db.collection)

  User.db.indexes.forEach(index => {
    collection.createIndex(index.keys, index.options)
  })

  /*
    // Create a user
    */
  const create = (payload) => {
    return new Promise((resolve, reject) => {
      if (is.not.object(payload)) {
        return reject(new Error('A payload is required to create a User'))
      }

      collection.insertOne(payload, (err, res) => {
        if (err) {
          return reject(err)
        }

        return resolve(res)
      })
    })
  }


  /*
    // Add Category
    */
  const addCategory = (email, category) => {
    return new Promise((resolve, reject) => {
      if (is.not.string(email)) {
        return reject(new Error('An email is required to add a Category'))
      }

      if (is.not.string(category.categories)) {
        console.log(email)
        console.log(category)
        return reject(new Error('Categories is required to add a Category'))
      }

      collection.findOneAndUpdate({ email }, { $addToSet: category }, (err, res) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  /*
    // Get a single user
    */
  const get = (email) => {
    return new Promise((resolve, reject) => {
      if (is.not.string(email)) {
        return reject(new Error('An email is required to get a User'))
      }

      collection.find({ email })
        .limit(1)
        .next((err, doc) => {
          if (err) {
            return reject(err)
          }

          if (doc) {
            return resolve(new User(doc))
          } else {
            return resolve()
          }
        })
    })
  }

  return { create, addCategory, get }
}
