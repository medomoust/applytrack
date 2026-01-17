import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Define constants directly since we're using String types
const COMPANIES = ['GOOGLE', 'APPLE', 'MICROSOFT', 'AMAZON', 'META', 'NETFLIX', 'TESLA', 'TWITTER', 'SPOTIFY', 'ADOBE'];
const USER_ROLES = { recruiter: 'recruiter', applicant: 'applicant' };
type Company = typeof COMPANIES[number];

const roles = [
  'Senior Software Engineer',
  'Frontend Developer',
  'Backend Engineer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Solutions Architect',
  'Data Engineer',
  'Machine Learning Engineer',
  'Product Manager',
  'Engineering Manager',
  'Staff Engineer',
  'Principal Engineer',
  'Tech Lead',
  'Mobile Developer',
  'QA Engineer',
];

const locations = [
  'San Francisco, CA',
  'New York, NY',
  'Seattle, WA',
  'Austin, TX',
  'Boston, MA',
  'Remote',
  'Los Angeles, CA',
  'Chicago, IL',
  'Denver, CO',
  'Portland, OR',
];

const workModes = ['remote', 'hybrid', 'onsite'];
const employmentTypes = ['fulltime', 'contract', 'intern'];
const applicationStatuses = ['wishlist', 'applied', 'interview', 'offer', 'rejected', 'ghosted'];
const priorities = ['low', 'medium', 'high'];

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

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.activityLog.deleteMany();
  await prisma.jobApplication.deleteMany();
  await prisma.jobPosting.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // Create recruiters (one for each company)
  console.log('👔 Creating recruiters...');
  const recruiters: Record<string, any> = {};
  
  for (const company of COMPANIES) {
    const recruiter = await prisma.user.create({
      data: {
        email: `recruiter@${company.toLowerCase()}.com`,
        password: hashedPassword,
        name: `${company} Recruiter`,
        role: USER_ROLES.recruiter,
        company: company,
      },
    });
    recruiters[company] = recruiter;
    console.log(`  ✓ Created recruiter for ${company}`);
  }

  // Create applicants
  console.log('🧑 Creating applicants...');
  const applicants = [];
  
  const applicantNames = [
    'John Doe',
    'Jane Smith',
    'Michael Johnson',
    'Emily Brown',
    'David Wilson',
    'Sarah Davis',
    'Chris Martinez',
    'Amanda Garcia',
  ];

  for (let i = 0; i < applicantNames.length; i++) {
    const name = applicantNames[i];
    const applicant = await prisma.user.create({
      data: {
        email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
        password: hashedPassword,
        name,
        role: USER_ROLES.applicant,
      },
    });
    applicants.push(applicant);
    console.log(`  ✓ Created applicant: ${name}`);
  }

  // Create job postings for each company
  console.log('📋 Creating job postings...');
  const jobPostings = [];
  
  for (const [companyKey, recruiter] of Object.entries(recruiters)) {
    const company = companyKey as Company;
    // Create 3-5 job postings per company
    const numPostings = 3 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < numPostings; i++) {
      const jobPosting = await prisma.jobPosting.create({
        data: {
          recruiterId: recruiter.id,
          company: company,
          roleTitle: randomItem(roles),
          location: randomItem(locations),
          workMode: randomItem(workModes) as any,
          employmentType: randomItem(employmentTypes) as any,
          description: `We are looking for an exceptional engineer to join our ${company} team. You will work on cutting-edge technology and solve challenging problems at scale.`,
          requirements: `• 5+ years of experience\n• Strong problem-solving skills\n• Excellent communication\n• Bachelor's degree in Computer Science or related field`,
          salaryRange: `$${150 + Math.floor(Math.random() * 100)}k - $${250 + Math.floor(Math.random() * 100)}k`,
          status: Math.random() > 0.2 ? 'open' : 'closed',
          createdAt: randomDate(60),
        },
      });
      jobPostings.push(jobPosting);
    }
    
    console.log(`  ✓ Created ${numPostings} job postings for ${company}`);
  }

  // Create applications (applicants applying to job postings)
  console.log('📝 Creating applications...');
  let totalApplications = 0;
  
  for (const applicant of applicants) {
    // Each applicant applies to 5-15 random job postings
    const numApplications = 5 + Math.floor(Math.random() * 11);
    const appliedPostings = new Set<string>();
    
    for (let i = 0; i < numApplications; i++) {
      // Pick a random open job posting that they haven't applied to yet
      let jobPosting;
      let attempts = 0;
      do {
        jobPosting = randomItem(jobPostings.filter(jp => jp.status === 'open'));
        attempts++;
      } while (appliedPostings.has(jobPosting.id) && attempts < 20);
      
      if (appliedPostings.has(jobPosting.id)) continue;
      appliedPostings.add(jobPosting.id);

      const appliedDate = randomDate(45);
      const status = randomItem(applicationStatuses);
      
      // Set next follow-up date for certain statuses
      let nextFollowUpDate = null;
      if (status === 'applied' || status === 'interview') {
        nextFollowUpDate = new Date(appliedDate);
        nextFollowUpDate.setDate(nextFollowUpDate.getDate() + 7);
      }

      const application = await prisma.jobApplication.create({
        data: {
          userId: applicant.id,
          jobPostingId: jobPosting.id,
          applicantName: applicant.name!,
          company: jobPosting.company,
          roleTitle: jobPosting.roleTitle,
          location: jobPosting.location,
          workMode: jobPosting.workMode,
          employmentType: jobPosting.employmentType,
          status: status as any,
          priority: randomItem(priorities) as any,
          appliedDate,
          nextFollowUpDate,
          salaryTarget: 150000 + Math.floor(Math.random() * 150000),
          notes: `Applied via ${randomItem(['LinkedIn', 'Company Website', 'Referral', 'Indeed', 'Glassdoor'])}`,
          createdAt: appliedDate,
        },
      });

      // Create activity log for the application
      await prisma.activityLog.create({
        data: {
          userId: applicant.id,
          jobApplicationId: application.id,
          eventType: 'created',
          description: `Applied to ${jobPosting.roleTitle} at ${jobPosting.company}`,
          createdAt: appliedDate,
        },
      });

      // Add status change activity if not in initial 'applied' state
      if (status !== 'applied' && status !== 'wishlist') {
        const statusDate = new Date(appliedDate);
        statusDate.setDate(statusDate.getDate() + Math.floor(Math.random() * 10) + 1);
        
        await prisma.activityLog.create({
          data: {
            userId: applicant.id,
            jobApplicationId: application.id,
            eventType: 'status_changed',
            description: `Status changed to ${status}`,
            metadata: { oldStatus: 'applied', newStatus: status },
            createdAt: statusDate,
          },
        });
      }

      totalApplications++;
    }
    
    console.log(`  ✓ Created ${appliedPostings.size} applications for ${applicant.name}`);
  }

  console.log('\n✨ Seed completed successfully!');
  console.log(`\n📊 Summary:`);
  console.log(`  • Recruiters: ${Object.keys(recruiters).length} (one per company)`);
  console.log(`  • Applicants: ${applicants.length}`);
  console.log(`  • Job Postings: ${jobPostings.length}`);
  console.log(`  • Applications: ${totalApplications}`);
  console.log(`\n🔐 Login Credentials:`);
  console.log(`  • All users have password: Password123!`);
  console.log(`\n👔 Recruiter Accounts:`);
  for (const company of COMPANIES) {
    console.log(`  • recruiter@${company.toLowerCase()}.com (${company})`);
  }
  console.log(`\n🧑 Applicant Accounts:`);
  for (const applicant of applicants) {
    console.log(`  • ${applicant.email} (${applicant.name})`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
