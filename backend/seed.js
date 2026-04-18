const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Video = require('./models/Video');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedData = async () => {
    try {
        await User.deleteMany();
        await Video.deleteMany();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword1 = await bcrypt.hash('password123', salt);
        const hashedPassword2 = await bcrypt.hash('password123', salt);

        const users = await User.insertMany([
            {
                username: 'john_doe',
                email: 'john@example.com',
                password: hashedPassword1,
                bio: 'Full Stack Developer & Technical Writer.',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
            },
            {
                username: 'jane_smith',
                email: 'jane@example.com',
                password: hashedPassword2,
                bio: 'UI/UX Designer who loves to code.',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
            }
        ]);

        console.log('Users seeded');

        const videos = await Video.insertMany([
            {
                title: 'Introduction to React 18',
                description: 'Learn the new features of React 18, including concurrent rendering and server components.',
                category: 'Web Development',
                tags: ['react', 'frontend', 'javascript'],
                thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                videoUrl: 'https://t.me/example_channel/1', // Example dummy link
                uploader: users[0]._id,
                views: 125,
            },
            {
                title: 'Data Structures: Hash Maps Explained',
                description: 'A deep dive into Hash Maps, collision resolution, and their big O complexity.',
                category: 'DSA',
                tags: ['dsa', 'algorithms', 'cs'],
                thumbnailUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                videoUrl: 'https://t.me/example_channel/2',
                uploader: users[0]._id,
                views: 340,
            },
            {
                title: 'Advanced Figma Techniques',
                description: 'Master auto-layout and component variants for a modern design system.',
                category: 'Design',
                tags: ['figma', 'ui', 'ux'],
                thumbnailUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                videoUrl: 'https://t.me/example_channel/3',
                uploader: users[1]._id,
                views: 50,
            },
            {
                title: 'Ace Your Next Technical Interview',
                description: 'Tips and tricks to perform well during a coding interview with top tech companies.',
                category: 'Interview Prep',
                tags: ['career', 'interview', 'faang'],
                thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                videoUrl: 'https://t.me/example_channel/4',
                uploader: users[1]._id,
                views: 890,
            }
        ]);

        console.log('Videos seeded');
        console.log('Data seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedData();
