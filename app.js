const express=require('express')
const app=express()
const path=require('path')
const mongoose=require('mongoose')
const { RSA_NO_PADDING } = require('constants')
const port=5000

mongoose.connect('mongodb://localhost/urlshort', {useNewUrlParser: true, useUnifiedTopology: true});

app.use(express.json())
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, "public")))

app.set('view engine', 'ejs')

const URLSchema= new mongoose.Schema({
    original_url: String,
    short_url: String
})

const URL=new mongoose.model('URL', URLSchema)
/*
URL.deleteMany((err)=>{
    if (err)
    {
        console.log(err)
    }
})
*/

URL.find((err, result)=>{
    if (err)
    {
        console.log(err)
    }
    else
    {
        console.log(result)
    }
})
app.post('/api/shorturl/new', async (req, res)=>
{
    console.log(req.body.url)
    let counter=await URL.estimatedDocumentCount()
    counter=counter+1
    const tempURL=new URL({original_url: req.body['url'], short_url: counter})
    tempURL.save((err, result)=>
    {
        if (err)
        {
            return console.log(err)
        }
        else
        {
            return res.json(result)
        }
    })


})

app.get('/api/shorturl/:url', async (req,res)=>
{
    console.log(req.params.url)
    URL.findOne({short_url: req.params.url}, (err, result)=>{
        if (err)
        {
            return console.log(err)
        }
        else
        {
            console.log(result)
            res.status(301).redirect(result['original_url'])
        }
    }) 
})


app.get('/', (req, res)=>
{
    res.render('index');
})

app.listen(port, ()=>
{
    console.log("The server is up and running on port "+ port)
})