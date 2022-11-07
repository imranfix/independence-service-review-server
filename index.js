const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;


// middle wares:
app.use(cors());
app.use(express.json());


// connect mongodb:
const uri = `mongodb+srv://${process.env._DB_USER}:${process.env._DB_PASSWORD}@cluster0.z6welky.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        const userCollection = client.db('Immigration').collection('users');
        const user ={
            name: 'canada',
            email: 'ca22@gmail.com'
        }
        const result = await userCollection.insertOne(user);
        console.log(result);
    }
    finally{

    }
}

run().catch(err =>console.log(err))



// test route:
app.get('/', (req, res) =>{
    res.send('New Immigration server is running');
});


app.listen(port, () =>{
    console.log(`Immigration server is running on port: ${port}`);
})