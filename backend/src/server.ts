import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import path from 'path';

import { initSockets } from './Sockets.class';
import { BlogController } from './controllers/blog.controller';
import { ChatController } from './controllers/chat.controller';
import { CommentController } from './controllers/comment.controller';
import { SpaceController } from './controllers/space.controller';
import { UserController } from './controllers/user.controller';
import { db, initDb } from './dataStore';
import { flagSlowReq } from './middleware';
import { errorHandler } from './middleware/errorHandler';
import { createRoutes } from './routes';
import { Origin, logger } from './utils';

(async () => {
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
  await initDb();

  const app = express();
  const port = process.env.PORT;
  const server = http.createServer(app);
  app.use(express.static('public'));

  initSockets(server);

  app.use(express.json());
  app.use(
    cors({
      origin: Origin,
      credentials: true,
    })
  );

  const user = new UserController(db);
  const blog = new BlogController(db);
  const space = new SpaceController(db);
  const comm = new CommentController(db);
  const chat = new ChatController(db);

  app.use(flagSlowReq);

  // Morgan → pipe logs into Winston
  app.use(morgan('dev', { stream: { write: message => logger.info(message.trim()) } }));

  app.get('/health', (_, res) => res.send('😊'));
  app.use(createRoutes(user, blog, comm, space, chat));

  app.use(errorHandler);

  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });

  // Handle React routing, return all requests to React app
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
  });
})();
