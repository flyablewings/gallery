const { PrismaClient } = require('@prisma/client');

async function checkDatabase() {
  const prisma = new PrismaClient();

  try {
    // Check if tables exist by trying to count projects
    const projectCount = await prisma.project.count();
    console.log(`Found ${projectCount} projects in database`);

    if (projectCount > 0) {
      console.log('Database already has data. Skipping initialization.');
      process.exit(0); // Success - data exists
    } else {
      console.log('Database tables exist but no data found.');
      process.exit(1); // No data - need to seed
    }
  } catch (error) {
    console.log('Database tables do not exist or connection failed:', error.message);
    process.exit(2); // Tables don't exist - need to create schema
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();