import dotenv from 'dotenv';
import sequelize from '../config/database';
import User from '../models/User';

dotenv.config();

const seed = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Sync to ensure table exists
        await sequelize.sync();

        const users = [
            {
                email: 'admin@clirec.com',
                password: 'Admin123!',
                fullName: 'CLIREC Administrator',
                role: 'Admin'
            },
            {
                email: 'user@clirec.com',
                password: 'User123!',
                fullName: 'Test User',
                role: 'User'
            }
        ];

        for (const u of users) {
            const existing = await User.findOne({ where: { email: u.email } });
            if (!existing) {
                // Create user (hooks will hash password)
                await User.create({
                    email: u.email,
                    password_hash: u.password,
                    full_name: u.fullName,
                    role: u.role
                });
                console.log(`Created user: ${u.email}`);
            } else {
                console.log(`User already exists: ${u.email}`);
            }
        }

        console.log('Seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
