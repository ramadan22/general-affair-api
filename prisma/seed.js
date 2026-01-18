import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
dotenv.config();
const prisma = new PrismaClient();
// ✅ Tambahkan dua baris ini untuk ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function main() {
    console.log('🌱 Starting seed process...');
    // ==============================
    // 1️⃣ SEED USERS
    // ==============================
    console.log('🌱 Seeding users...');
    const defaultPassword = await bcrypt.hash('123456', 10);
    await prisma.user.createMany({
        data: [
            {
                firstName: 'Staff',
                lastName: '',
                email: 'staff@example.com',
                password: defaultPassword,
                role: 'STAFF',
                isActive: true,
            },
            {
                firstName: 'GA',
                lastName: '',
                email: 'ga@example.com',
                password: defaultPassword,
                role: 'GA',
                isActive: true,
            },
            {
                firstName: 'Coordinator',
                lastName: '',
                email: 'coordinator@example.com',
                password: defaultPassword,
                role: 'COORDINATOR',
                isActive: true,
            },
            {
                firstName: 'Lead',
                lastName: '',
                email: 'lead@example.com',
                password: defaultPassword,
                role: 'LEAD',
                isActive: true,
            },
            {
                firstName: 'Manager',
                lastName: '',
                email: 'manager@example.com',
                password: defaultPassword,
                role: 'MANAGER',
                isActive: true,
            },
        ],
        skipDuplicates: true,
    });
    console.log('✅ Users seeding complete.');
    // ==============================
    // 2️⃣ SEED LOCATIONS (via SQL)
    // ==============================
    // console.log('🌱 Seeding locations (from SQL file)...');
    // const sqlFilePath = path.join(__dirname, './sql/locations.sql');
    // const sql = readFileSync(sqlFilePath, 'utf8');
    // const client = new Client({
    //   connectionString: process.env.DATABASE_URL,
    // });
    // await client.connect();
    // await client.query(sql);
    // await client.end();
    // console.log('✅ Locations seeding complete.');
    // console.log('🎉 All seeding done successfully!');
}
main()
    .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
