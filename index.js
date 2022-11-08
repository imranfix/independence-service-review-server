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
        const serviceCollection = client.db('Immigration').collection('users');
        
        // get Read data:
        app.get('/services', async(req, res) =>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        });

        // get Read data for sell all page: 
        app.get('/serviceAll', async(req, res) =>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

       
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