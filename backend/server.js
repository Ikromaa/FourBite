import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/db.js'


import userRouter from './routes/userRoutes.js'
import itemRouter from './routes/itemRoute.js'
import cartRouter from './routes/cartRoutes.js'
import orderRouter from './routes/orderRoutes.js'


const app = express();
app.set('trust proxy', 1);
const port = process.env.PORT || 4000;


// MIDLEWARE
app.use(cors({
    origin: (origin,callback) => {
        const allowedOrigins = [
            'https://ikroma.store',
            'https://www.ikroma.store',
            'https://fourbite-frontend.onrender.com',
            'https://fourbite-admin.onrender.com',
            'http://localhost:4000',
            'http://localhost:5173',
            'http://localhost:5174'
        ];
        if(!origin || allowedOrigins.includes(origin)) {
            callback(null,true)
        }

        else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DATABASE
connectDB();

// ROUTES
app.use('/api/user', userRouter)
app.use('/api/items', itemRouter)
app.use('/api/cart', cartRouter)
app.use('/api/orders', orderRouter)

app.get('/', (req, res) => {
    res.send('API WORKING')
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
});