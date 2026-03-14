import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

import app from './app.js'
import connectDB from './db/index.js'

/*
dotenv.config({
    path: './env'
})
*/


/*
First Approach -> Not Professional

const app = express()

function connectDB(){}

// ()() Immediately invoked function

;( async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        app.on('error', (error) => {
            console.log(`Error in Application`)
        })

        app.listen(process.env.PORT, () => {
            console.log(`App Listening at Port ${process.env.PORT}`)
        })
    } catch (error) {
        console.error(error.message, error)
        throw error
    }
})()

*/

const PORT = process.env.PORT || 8000;


connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`App listening at Port: ${PORT}`)
        })
    })
    .catch((error) => {
        console.log(`Mongo DB Connection Failed! ${error.message}`, error)
    })