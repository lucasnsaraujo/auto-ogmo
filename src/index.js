import 'express-async-errors';
import express from 'express';
import cron from 'node-cron'
import { crawlWorkData } from './functions/crawlWorkData.js'
import routes from './routes.js'

const app = express();

app.use(express.json())

app.use(routes)

// cron.schedule('*/10 * * * *', async () => {
//     await crawlWorkData({
//         user_login: '',
//         user_password: ''
//     })
// })

const PORT = 1234

app.listen(PORT, () => {
    console.log(`> 💻 Server started @ http://localhost:${PORT}`);
})