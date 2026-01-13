import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const companies = [
  'Google', 'Meta', 'Amazon', 'Microsoft', 'Apple',
  'Netflix', 'Tesla', 'Stripe', 'Airbnb', 'Uber',
  'Lyft', 'Spotify', 'Dropbox', 'Slack', 'Zoom',
  'Shopify', 'Square', 'Twitter', 'LinkedIn', 'Adobe',
];

const roles = [
  'Senior Software Engineer',
  'Frontend Developer',
  'Backend Engineer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Solutions Architect',
  'Engineering Manager',
  'Staff Engineer',
  'Principal Engineer',
  'Tech Lead',
];

const locations = [
  'San Francisco, CA',
  'New York, NY',
  'Seattle, WA',
  'Austin, TX',
  'Boston, MA',
  'Remote',
  'London, UK',
  'Toronto, Canada',
  'Berlin, Germany',
  'Singapore',
];

const statuses = ['wishlist', 'applied', 'interview', 'offer', 'rejected', 'ghosted'];
const priorities = ['low', 'medium', 'high'];
const workModes = ['remote', 'hybrid', 'onsite'];
const employmentTypes = ['fulltime', 'contract', 'intern'];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysBack: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date;
}

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.activityLog.deleteMany();
  await prisma.jobApplication.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  console.log('👤 Creating admin user...');
  const adminPassword = await bcrypt.hash('Password123!', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@applytrack.dev',
      password: adminPassword,
      name: 'Admin User',
      role: 'admin',
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // Create demo user
  console.log('👤 Creating demo user...');
  const demoPassword = await bcrypt.hash('Password123!', 10);
  const demo = await prisma.user.create({
    data: {
      email: 'demo@applytrack.dev',
      password: demoPassword,
      name: 'Demo User',
      role: 'user',
    },
  });
  console.log(`✅ Demo user created: ${demo.email}`);

  // Create job applications for demo user
  console.log('📝 Creating job applications...');
  const applications = [];

  for (let i = 0; i < 35; i++) {
    const company = randomItem(companies);
    const roleTitle = randomItem(roles);
    const status = randomItem(statuses);
    const createdAt = randomDate(60);

    const application = await prisma.jobApplication.create({
      data: {
        userId: demo.id,
        company,
        roleTitle,
        location: randomItem(locations),
        workMode: randomItem(workModes),
        employmentType: randomItem(employmentTypes),
        status,
        priority: randomItem(priorities),
        appliedDate: ['applied', 'interview', 'offer', 'rejected', 'ghosted'].includes(status)
          ? randomDate(45)
          : null,
        nextFollowUpDate: ['applied', 'interview'].includes(status)
          ? new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000)
          : null,
        salaryTarget: Math.floor(Math.random() * 100000) + 100000,
        link: `https://jobs.${company.toLowerCase().replace(/\s+/g, '')}.com/positions/${i}`,
        notes: `Application for ${roleTitle} position. ${
          status === 'interview' ? 'Scheduled for next week.' : 
          status === 'offer' ? 'Great offer received!' :
          status === 'rejected' ? 'Not a good fit.' :
          'Waiting for response.'
        }`,
        archived: Math.random() > 0.9,
        createdAt,
        updatedAt: createdAt,
      },
    });

    applications.push(application);

    // Create activity logs
    await prisma.activityLog.create({
      data: {
        userId: demo.id,
        jobApplicationId: application.id,
        eventType: 'created',
        description: `Created application for ${roleTitle} at ${company}`,
        createdAt,
      },
    });

    if (['applied', 'interview', 'offer', 'rejected', 'ghosted'].includes(status)) {
      const statusChangeDate = new Date(createdAt);
      statusChangeDate.setDate(statusChangeDate.getDate() + Math.floor(Math.random() * 10));

      await prisma.activityLog.create({
        data: {
          userId: demo.id,
          jobApplicationId: application.id,
          eventType: 'status_changed',
          description: `Changed status to ${status}`,
          metadata: { oldStatus: 'wishlist', newStatus: status },
          createdAt: statusChangeDate,
        },
      });
    }

    if (application.archived) {
      await prisma.activityLog.create({
        data: {
          userId: demo.id,
          jobApplicationId: application.id,
          eventType: 'archived',
          description: `Archived application for ${roleTitle} at ${company}`,
          createdAt: new Date(application.updatedAt.getTime() + 1000),
        },
      });
    }
  }

  console.log(`✅ Created ${applications.length} job applications`);

  // Create a few applications for admin
  console.log('📝 Creating admin applications...');
  for (let i = 0; i < 5; i++) {
    const company = randomItem(companies);
    const roleTitle = randomItem(roles);
    const createdAt = randomDate(30);

    await prisma.jobApplication.create({
      data: {
        userId: admin.id,
        company,
        roleTitle,
        location: randomItem(locations),
        workMode: randomItem(workModes),
        employmentType: randomItem(employmentTypes),
        status: randomItem(statuses),
        priority: randomItem(priorities),
        createdAt,
        updatedAt: createdAt,
      },
    });
  }

  console.log('✅ Seed completed successfully!');
  console.log('\n📋 Login credentials:');
  console.log('Admin: admin@applytrack.dev / Password123!');
  console.log('Demo:  demo@applytrack.dev / Password123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
