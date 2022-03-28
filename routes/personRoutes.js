require('dotenv').config()
const express = require('express')
const router = require('express').Router()

const { append, json } = require('express/lib/response')
const { name } = require('tar/lib/types')
const { db } = require('../models/Person')
const Person = require ('../models/Person')

const nodemailer = require('nodemailer')
const {google} = require('googleapis')
const res = require('express/lib/response')
const { text } = require('express')

const CLIENT_ID = process.env.CLIENT_ID2
const  CLIENT_SECRET = encodeURIComponent(process.env.CLIENT_SECRET2)
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const  REFRESH_TOKEN = process.env.REFRESH_TOKEN2

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

//email = "servisim.auth@gmail.com"


//CREATE - Criação de dados
router.post('/', async (req, res) =>{

    const {nome, email, password, telefone, genero, data_nascimento, endereco, cidade, estado } = req.body

  

    const person ={
        nome,
        email,
        password,
        telefone,
        genero,
        data_nascimento,
        endereco,
        cidade,
        estado
       
    }

     try{
        await Person.create(person)
        res.status(201).json({message: 'pessoa inserida na agenda com sucesso'})

      
        
        async function sendMail(require = email){
        
            
            try{
                const accessToken = await oAuth2Client.getAccessToken()
                const transport = nodemailer.createTransport({
                    service: 'gmail',
                    auth:{
                        type: 'Oauth2',
                        user: process.env.user2,
                        clientId: CLIENT_ID,
                        clientSecret: CLIENT_SECRET,
                        refreshToken: REFRESH_TOKEN,
                        accessToken: accessToken
                    }
                })
        
               
                    function tokenAle(a,b){
                        var token = Math.floor(Math.random() * (b -a +1)) + a
                         return token
                        
                    }
        
                    token = tokenAle(000001, 999999)
                   
                    var copia = token;
                const mailOptions ={
                    
                    from: 'SERVISIM ✉️ <process.env.user2>',
                    to: email,
                   
                    subject: 'o seu codigo para autenticação',
                    text: `${token}`,
                    html: `<h1>o seu codigo para autenticação é o ${token} </h1>` 
                
                }
        
              
                console.log(copia)
        
                const result = await transport.sendMail(mailOptions)
                return result 
        
            }catch(error){
                return error;
        
            }
        }
        
        sendMail()
        .then((result) => console.log('Email send...', result))
        .catch((error) => console.log(error.message));
        

     }catch(erro){
         res.status(500).json({Error: erro})
  
     }
 
})

//READ - Leitura de todos os dados
router.get('/', async (req, res) => {
    
    try{
      const people = await Person.find()
      res.status(200).json(people)

     }catch(erro){
         res.status(500).json({Error: erro})
  
     }

})

//READ - busca por um dado em especifico
router.get('/:id', async(req, res) =>{

    // extrair o dado da requisição pela url = req.params
    const id = req.params.id
 
 try{
     const person = await Person.findOne({_id: id})

        if(!person){
            res.status(422).json({message:'usuario nao foi encontrado'})
            return
        }
     
     res.status(200).json(person)

 }catch(error){
     res.status(500).json({Error: error})

 }

})

//READ - ler todos os dados de um nome em especifico
/*router.get('/:nome', async (req, res) =>{

        try{
            const person = await Person.findOne({nome: nome})
 
          res.status(200).json(person)
            
         }catch(erro){
             res.status(500).json({Error: erro})
      
         }
    
    })

*/

//UPDATE - atualização de dados PUT e PATCH
router.patch('/:id', async (req, res) => {
    const id = req.params.id
    const{nome, dia, mes, existe} = req.body

    const person ={
        nome,
        dia,
        mes,
        existe,

    }
    try{
    const updatedPerson = await Person.updateOne({_id: id}, person)
    res.status(422).json({message:'o usuário não foi encontrado'})
    return

    if(updatedPerson.matchedCount ===0){

    }
    res.status(200).json(person)

    }catch(error){
        res.status(500).json({Error: error})

    }

})

//DELETE - deletar dados

router.delete('/:id', async (req, res) =>{
    const id= req.params.id

    const person = await Person.findOne({_id: id})

    if(!person){
        res.status(422).json({message:'usuário não encontrado'})
        return
    }

try{

    await Person.deleteOne({_id: id})
    res.status(200).json({message: 'usuário removido com sucesso'})

}catch(error){
    res.status(500).json({Error: error})

}


})

/*router.post('/pin', async (req, res) => {

    const {email} = req.body
    
    try{
     await email.params

     }catch(erro){
         res.status(500).json({Error: erro})
  
     }

})
*/





module.exports = router
