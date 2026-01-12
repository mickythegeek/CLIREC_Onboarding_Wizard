import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import requirementRoutes from './routes/requirementRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requirements', requirementRoutes);
app.use('/api/admin', adminRoutes);

export default app;
