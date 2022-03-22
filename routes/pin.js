const router = require('express').Router()

const nodemailer = require('nodemailer')
const {google} = require('googleapis')
const res = require('express/lib/response')
const { text } = require('express')

const CLIENT_ID = '635710621906-m48q4h63r6ijj8i3mm0i5ij980if8bbb.apps.googleusercontent.com'
const  CLIENT_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const  REFRESH_TOKEN = '1//042OqknkzEhhwCgYIARAAGAQSNwF-L9IrRaSI8GhQHHBeeE4pdzdaaW97Z0jamvGMG-FEyOQaaGH-zktBpYQcvN788hZldyMn8NQ'

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

var email = "servisim.auth@gmail.com"

async function sendMail(require = email){

    
    try{
        const accessToken = await oAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                type: 'Oauth2',
                user: 'servisim.auth@gmail.com',
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
            
            from: 'SERVISIM ✉️ <servisim.auth@gmail.com>',
            to: email,
           // henriquelima@edu.unifor.br, danielmcolares@gmail.com, guttemberg@edu.unifor.br
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
