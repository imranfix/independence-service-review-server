const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;


// middle wares setUp:
app.use(cors());
app.use(express.json());


// connect mongodb:
const uri = `mongodb+srv://${process.env._DB_USER}:${process.env._DB_PASSWORD}@cluster0.z6welky.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        const serviceCollection = client.db('Immigration').collection('users');
        const orderCollection = client.db('Immigration').collection('orders');
        
        //1. services data Read with get (operation):
        app.get('/services', async(req, res) =>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        });

        //2. get Read data for see-all page: 
        app.get('/serviceAll', async(req, res) =>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        // 3. dynamic service route and get read data:
        app.get('/services/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        // 4. orders data Create with post (operation):
        app.post('/orders', async(req, res) =>{
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        });

        // 5. call orders data from the databse and read data:
        app.get('/orders', async(req, res) =>{
            // console.log(req.query);
            let query = {};
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        });

        // 6. delete
        app.delete( '/orders/:id', async(req, res) =>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        })


       
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