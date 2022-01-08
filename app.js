import express from "express"
import morgan from "morgan"
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import dbConnections from "./config/db"

// Config env file
dotenv.config({ path: 'config/.env' });

// Connect to database
dbConnections;

// Create express app
const app = express()

// Config Body Parser
app.use(bodyParser.json())


// Configure app to use morgan
if (process.env.NODE_ENV === 'development') {
    app.use(cors({
        origin: process.env.CLIENT_URL,
    }))
    app.use(morgan('dev'))
}
 
// Load all routes
import authRoutes from './routes/authRoutes.js';

// Use Routes
app.use('/api/', authRoutes);


// Specify the 404 response
app.use((req, res) => {
  res.status(404).json({
    success: false,
    msg: "Page not founded",
  });
});

//  specify the port
const port = process.env.PORT

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))