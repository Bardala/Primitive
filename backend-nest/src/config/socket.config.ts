const allowedOrigins = process.env.ALLOWED_ORIGINS;
const origin = allowedOrigins
  ? allowedOrigins.split(',').map((url) => url.trim())
  : process.env.FRONTEND_URL || 'http://localhost:3000';

export const SocketConfig = {
  cors: {
    origin,
    methods: ['GET', 'POST'],
    credentials: true,
  },
};
