'use strict'
require('dotenv').config()
const express = require('express')
const ping = require('ping')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

const PORT = process.env.PORT
const pingConfig = {
    timeout: 10,
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

app.get('/checkIP',async(req,res) => {
    const {ipList} = req.body
    new Promise((resolve,reject) => {
        let length = ipList.length
        const arr = []
        ipList.forEach(ip => {
            try{
                ping.sys.probe(ip, function(isAlive){
                    if(isAlive){
                        arr.push({
                            ip,
                            status:'online'
                        })
                    }else{
                        arr.push({
                            ip,
                            status:'offline'
                        })
                    }
                    if(arr.length == length){
                        length += 1
                        resolve(arr)
                    }
                }, pingConfig);
            }catch(err){
                console.log(err)
                arr.push({
                    ip,
                    status:'offline'
                })
                if(arr.length == length){
                    length += 1
                    resolve(arr)
                }
            }
        })
    }).then((arr) => {
        res.send(arr)
    })
})