//configuração inicial
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app =  express()



// forma de ler Json / middlewares 
app.use(
    express.urlencoded({
        extended: true,
    }),
)
app.use(express.json())

//rotas da API
const personRoutes = require('./routes/personRoutes')
app.use('/person', personRoutes)

//rota inicial / endpoint
app.get('/',(req, res) =>{

//mostrar req

res.json({message: 'Oi express!'})

})


//entregar uma porta


mongoose.connect(
    process.env.MONGO_URL, 
    {
useNewUrlParser: true
}
);

app.listen(process.env.PORT || 3000);
