const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x5y82lv.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const brandsCollection = client.db('productsDB').collection('brands');
        const productsCollection = client.db('productsDB').collection('products');
        const usersCollection = client.db('productsDB').collection('userProducts');

        // Brands related API
        try {
            app.get('/brands', async (req, res) => {
                const cursor = brandsCollection.find();
                const result = await cursor.toArray();
                res.send(result);
            })
        }
        catch (error) {
            console.log(error);
        }

        // Products related APIs
        try {
            app.get('/products', async (req, res) => {
                const cursor = productsCollection.find();
                const result = await cursor.toArray();
                res.send(result);
            })
        }
        catch (error) {
            console.log(error);
        }

        try {
            app.get('/products/:id', async (req, res) => {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const result = await productsCollection.findOne(query);
                res.send(result);
            })
        }
        catch (error) {
            console.log(error);
        }

        try {
            app.post('/products', async (req, res) => {
                const newProduct = req.body;
                console.log(newProduct);
                const result = await productsCollection.insertOne(newProduct);
                res.send(result);
            })
        }
        catch (error) {
            console.log(error);
        }

        try {
            app.patch('/products/:id', async (req, res) => {
                const id = req.params.id;
                const filter = { _id: new ObjectId(id) }
                // const options = { upsert: true };   // for PUT
                const updatedProduct = req.body;

                const product = {
                    $set: {
                        image: updatedProduct.image,
                        name: updatedProduct.name,
                        brandName: updatedProduct.brandName,
                        type: updatedProduct.type,
                        price: updatedProduct.price,
                        rating: updatedProduct.rating
                    }
                }

                const result = await productsCollection.updateOne(filter, product);
                res.send(result);
            })
        }
        catch (error) {
            console.log(error);
        }

        // User products related APIs
        try {
            app.get('/userProducts', async (req, res) => {
                const cursor = usersCollection.find();
                const result = await cursor.toArray();
                res.send(result);
            })
        }
        catch (error) {
            console.log(error);
        }

        try {
            app.post('/userProducts', async (req, res) => {
                const userNewProduct = req.body;
                console.log(userNewProduct);
                const result = await usersCollection.insertOne(userNewProduct);
                res.send(result);
            })
        }
        catch (error) {
            console.log(error);
        }

        try {
            app.delete('/userProducts/:id', async (req, res) => {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) }
                const result = await usersCollection.deleteOne(query);
                res.send(result);
            })
        }
        catch (error) {
            console.log(error);
        }

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Brand shop server is running');
})

app.listen(port, () => {
    console.log(`Brand shop server is running on port: ${port}`);
})