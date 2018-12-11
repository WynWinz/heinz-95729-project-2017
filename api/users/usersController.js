module.exports.name = 'usersController'
module.exports.dependencies = ['router', 'register', 'login', 'modifyUser', 'logger']
module.exports.factory = (
  router,
  { register, validateBody },
  { getUser, makeAuthToken },
  { addCategory, removeCategory },
  logger
) => {
  router.post('/users', function (req, res) {
    const body = req.body

    Promise.resolve(body)
      .then(body => new Promise(getUser(body.email)))
      .then(user => {
        if (user) {
          throw new Error('A user with that email address already exists')
        }

        return body
      })
      .then(body => new Promise(validateBody(body)))
      .then(body => new Promise(register(body)))
      .then(() => new Promise(getUser(body.email)))
      .then(user => new Promise(makeAuthToken(user)))
      .then(response => {
        res.status(201).send(response)
      }).catch(err => {
        logger.error(err)
        res.status(400).send({ messages: [err.message] })
      })
  })

  router.post('/users/login', function (req, res) {
    Promise.resolve(req.body.email)
      .then(email => new Promise(getUser(email)))
      .then(user => new Promise(makeAuthToken(user)))
      .then(response => {
        res.status(200).send(response)
      }).catch(err => {
        logger.error(err)
        res.status(400).send({ messages: [err.message] })
      })
  })

  router.put('/users/:email/category', function (req, res) {
    const body = req.body

    Promise.resolve(body)
      .then(() => new Promise(getUser(req.params.email)))
      .then(user => {
        if (!user) {
          throw new Error('A user with that email address does not exist')
        }

        return body
      })
      .then(body => new Promise(addCategory(req.params.email, body)))
      .then(response => {
        res.status(200).send(response)
      }).catch(err => {
        logger.error(err)
        res.status(400).send({ messages: [err.message] })
      })
  })

  router.delete('/users/:email/category', function (req, res) {
    const body = {categories: req.query.categories}
    Promise.resolve(body)
      .then(() => new Promise(getUser(req.params.email)))
      .then(user => {
        if (!user) {
          throw new Error('A user with that email address does not exist')
        }

        return body
      })
      .then(body => new Promise(removeCategory(req.params.email, body)))
      .then(response => {
        res.status(200).send(response)
      }).catch(err => {
        logger.error(err)
        res.status(400).send({ messages: [err.message] })
      })
  })

  return router
}
