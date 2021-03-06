import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import dotenv from 'dotenv';
import tripsRouter from './router';
dotenv.config();

const port = process.env.PORT || 3001;

const app: express.Application = express();
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

process.env.NODE_ENV === 'production'
  ? app.use(express.static(path.join(__dirname, 'build')))
  : null;

app.use('/api', tripsRouter);

process.env.NODE_ENV === 'production'
  ? app.get('/*', (req, res) => {
      res.sendFile(path.join(__dirname, 'build', 'index.html'));
    })
  : null;

// eslint-disable-next-line
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'invalid token...' });
  }

  return res.status(500).json({
    message: err.message,
    // we only add a `stack` property in non-production environments
    ...(process.env.NODE_ENV === 'production' ? null : { stack: err.stack }),
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
