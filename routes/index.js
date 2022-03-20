const auth = require('./auth')
const post = require('./post')

function route(app) {

    app.use('/auth', auth)
    app.use('/post', post)

}


module.exports = route