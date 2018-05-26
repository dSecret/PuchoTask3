const express = require('express')
const cookieSession = require('cookie-session')
const passport = require('passport')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')
const bodyParser = require("body-parser")
// multer for handlng files
const multer = require('multer')
const  fs= require('fs')

// keys
const passportSetup = require('./config/passport-setup')
const keys = require('./config/keys')
//func using vision api 
// const Label = require("./models/labelDetection")
// const Shot = require("./models/shotChange")
// const EC = require("./models/ecDetection.js")
const GCV = require("./models/gcvision.js")

// gc-storage
const Upload = require("./models/handleUpload")

// aws-rek
const Rek = require("./models/rek.js")


// initialize express app
const app = express()
// setup multer 
const upload = multer({ dest: `./uploads` }) 


app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// set up session cookies
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}))

// initialize passport
app.use(passport.initialize())
app.use(passport.session())

// connect to mongodb
mongoose.connect(keys.mongodb.dbURI, () => {
    console.log('connected to mongodb')
})


// // for static files like main.js(vuejs bundle)
app.use("/dist", express.static(__dirname + '/dist'))

// serve index.html 
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname+'/index.html'))
})
// to send user info
app.post('/getUser',function(req,res){
	res.send(req.user)
	res.end()
})


// handle requests to GC-vision api
app.post('/detectGCP',upload.single('avatar'),(req,res)=>{
	var filename=req.file.filename
    fs.rename('./uploads/'+filename, './uploads/'+filename+'.mp4', function(err) {
        GCV.SetUpPath(filename)
        // Promise.all([
        //     GCV[req.body.type]()    
        // ])
        GCV[req.body.type]()
        .then((values)=>{
            console.log(values)
            res.send(values)
            res.end()
        })
        
    })

})

// handle requests to AWS-Rek
app.post('/detectRek',upload.single("uploads"),(req,res)=>{
    var filename=req.file.filename
    console.log(filename)
    Rek.DetectLabelsTest('./uploads/'+filename)
        .then((data)=>{
            console.log(data)
            res.send(data)
            // res.end()
        })

})

// function Rename(foo){
//     let bar=foo.map((e)=>{
//         fs.rename('./uploads/'+e.filename, './uploads/faces/'+e.filename+'.jpg',()=>{
//         })
//         return './uploads/faces/'+e.filename+'.jpg'

//     })
//     return bar
// }
// // auth with google+
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile']
}))

// // callback route for google to redirect to
// // hand control to passport to use code to grab profile info
app.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('/')
})
// // auth logout
app.post('/logout', (req, res) => {
    req.logout()
    res.send({})
    res.end()
})
// app is listening for requests at port 3000
app.listen(3000, () => {
    console.log('app now listening for requests on port 3000')
})
