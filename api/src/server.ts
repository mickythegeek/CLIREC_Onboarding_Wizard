import app from './app';
import sequelize from './config/database';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Sync models (force: false means it won't drop tables if they exist)
        // alter: true updates table structure if model changes
        await sequelize.sync({ alter: true });
        console.log('Database synced.');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();
