const express = require('express');
const app = express();

app.listen(3000, function () {
    console.log('listening on 3000')
})

app.get('/', function (request, response) {
    // do something here
    response.send({response : 'hello world'})
})

app.get('/acomodador/info', function (request, response) {
    // do something here
    response.send({ acomodador: 'test' })
})