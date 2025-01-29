import express from 'express';
import userRouter from './routes/user.router.js';
import messageRouter from './routes/message.router.js';
// ...existing code...

const app = express();

// ...existing code...

app.use('/users', userRouter);
app.use('/flats', messageRouter);

// ...existing code...

export default app;
