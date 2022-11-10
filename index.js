const express = require('express');
const app = express();
const cors = require('cors');
// jwt token:
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;


// middle wares setUp:
app.use(cors());
app.use(express.json());


// connect mongodb:
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.z6welky.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// jwt token function:
    function verificationJWT(req, res, next){
    const authHeader = req.headers.authorization;

    if(!authHeader){
      return res.status(401).send({messsage: 'unauthorized access'})
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
        if(err){
           return res.status(403).send({messsage: 'forbidden access'})
        }
        req.decoded = decoded;
        next();
    })
}


async function run() {
    try{
        const serviceCollection = client.db('Immigration').collection('users');
        const orderCollection = client.db('Immigration').collection('orders');
        const reviewCollection = client.db('Immigration').collection('reviews');


          // 8. Jwt token:
          app.post('/jwt', async(req, res) =>{
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})
            res.send({token})
        });


        
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
        app.post('/orders', verificationJWT ,async(req, res) =>{
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        });


        // 5. call orders data from the databse and read data + JWT Token:
        app.get('/orders', verificationJWT , async(req, res) =>{
            const decoded = req.decoded;

            if(decoded.email !== req.query.email){
                res.status(403).send({messsage: 'forbidden access'})
            }

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


        // 6. delete operation route:
        app.delete( '/orders/:id', verificationJWT ,async(req, res) =>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        });


        // 7. Update operation change status:
        app.patch('/orders/:id', verificationJWT , async(req, res) =>{
            const id = req.params.id;
            const status = req.body.status
            const query = { _id: ObjectId(id) }
            const updateDoc = {
                $set: {
                    status: status
                }
            }
            const result = await orderCollection.updateOne(query, updateDoc);
            res.send(result);
        });

        //9. Edit/Update review:
        app.get('reviews/:id', async(req, res) =>{
            const id = req.params.id
            const query = {_id: ObjectId(id) };
            const review = await reviewCollection.findOne(query);
            res.send(review);
        });
        // ----------------------

      
       
    }

    finally{

    }
}

run().catch(err =>console.log(err))



// test route server:
app.get('/', (req, res) =>{
    res.send('New Immigration server is running');
});


app.listen(port, () =>{
    console.log(`Immigration server is running on port: ${port}`);
})