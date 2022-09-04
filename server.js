'use strict'
require('dotenv').config()
const express = require('express')
const ping = require('ping')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

const PORT = process.env.PORT
const pingConfig = {
    timeout: 5,
}

app.use(bodyParser.json())
app.use(cors())
app.listen(PORT,(err) => {
    if(err){
        console.log(err)
    }else{
        console.log('server started')
    }
})

app.post('/checkIP',async(req,res) => {
    const branch = req.body
    try{
        ping.sys.probe(branch.branchIP, function(isAlive){
            if(isAlive){
                res.send({
                    branch:branch.branchName,
                    status:'online'
                })
            }else{
                res.send({
                    branch:branch.branchName,
                    status:'offline'
                })
            }
        }, pingConfig);
    }catch(err){
        console.log(err)
        res.send({
            branch:branch.branchName,
            status:'offline'
        })
    }
})