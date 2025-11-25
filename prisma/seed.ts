import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create default plan
  const plan = await prisma.plan.upsert({
    where: { code: "PLAN_4_PER_MONTH" },
    update: {},
    create: {
      code: "PLAN_4_PER_MONTH",
      name: "4 Activities / Month",
      description: "Book up to 4 activities per month for your children",
      priceCents: 2900,
      currency: "EUR",
      creditsPerPeriod: 4,
      period: "MONTHLY",
      isActive: true,
    },
  });
  console.log("✅ Created plan:", plan.name);

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@kidspass.com" },
    update: {},
    create: {
      email: "admin@kidspass.com",
      passwordHash: adminPassword,
      name: "Admin User",
      role: "ADMIN",
      city: "Munich",
    },
  });
  console.log("✅ Created admin user:", admin.email);

  // Create demo parent user
  const parentPassword = await bcrypt.hash("parent123", 12);
  const parent = await prisma.user.upsert({
    where: { email: "emma@example.com" },
    update: {},
    create: {
      email: "emma@example.com",
      passwordHash: parentPassword,
      name: "Emma Smith",
      role: "PARENT",
      city: "Munich",
    },
  });
  console.log("✅ Created demo parent:", parent.email);

  // Create subscription for demo parent
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  await prisma.subscription.upsert({
    where: { userId: parent.id },
    update: {},
    create: {
      userId: parent.id,
      planId: plan.id,
      status: "ACTIVE",
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
    },
  });
  console.log("✅ Created subscription for demo parent");

  // Create child for demo parent
  const child = await prisma.child.upsert({
    where: { id: "demo-child-alex" },
    update: {},
    create: {
      id: "demo-child-alex",
      userId: parent.id,
      name: "Alex",
      birthDate: new Date("2017-03-15"),
      interests: ["SPORTS", "MUSIC", "OUTDOOR"],
    },
  });
  console.log("✅ Created demo child:", child.name);

  // Create partners
  const partners = [
    {
      name: "City Soccer Club",
      description: "Premier youth soccer training facility in Munich",
      address: "450 Bay Street",
      city: "Munich",
      postcode: "80331",
      contactEmail: "info@citysoccer.de",
    },
    {
      name: "Playground Sports",
      description: "Multi-sport facility for kids of all ages",
      address: "123 Sports Avenue",
      city: "Munich",
      postcode: "80333",
      contactEmail: "hello@playgroundsports.de",
    },
    {
      name: "Harmony Music School",
      description: "Expert music education for young learners",
      address: "78 Music Lane",
      city: "Munich",
      postcode: "80336",
      contactEmail: "contact@harmonymusic.de",
    },
    {
      name: "Creative Kids Studio",
      description: "Art and creativity workshops for children",
      address: "55 Art Street",
      city: "Munich",
      postcode: "80339",
      contactEmail: "info@creativekids.de",
    },
    {
      name: "Climbing Gym",
      description: "Indoor climbing and bouldering for kids",
      address: "200 Boulder Road",
      city: "Munich",
      postcode: "80335",
      contactEmail: "climb@climbinggym.de",
    },
  ];

  const createdPartners = [];
  for (const partnerData of partners) {
    const partner = await prisma.partner.upsert({
      where: { id: partnerData.name.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: {
        id: partnerData.name.toLowerCase().replace(/\s+/g, "-"),
        ...partnerData,
      },
    });
    createdPartners.push(partner);
    console.log("✅ Created partner:", partner.name);
  }

  // Create activities
  const activities = [
    {
      partnerId: createdPartners[0].id,
      title: "Soccer",
      description: "Learn soccer fundamentals and teamwork skills",
      category: "SPORTS" as const,
      ageMin: 6,
      ageMax: 12,
      locationAddress: createdPartners[0].address,
      city: createdPartners[0].city,
      animalIcon: "rabbit",
    },
    {
      partnerId: createdPartners[1].id,
      title: "Basketball",
      description: "Fun basketball training for beginners",
      category: "SPORTS" as const,
      ageMin: 7,
      ageMax: 14,
      locationAddress: createdPartners[1].address,
      city: createdPartners[1].city,
      animalIcon: "fox",
    },
    {
      partnerId: createdPartners[2].id,
      title: "Piano",
      description: "Individual and group piano lessons",
      category: "MUSIC" as const,
      ageMin: 5,
      ageMax: 12,
      locationAddress: createdPartners[2].address,
      city: createdPartners[2].city,
      animalIcon: "dog",
    },
    {
      partnerId: createdPartners[3].id,
      title: "Art Class",
      description: "Painting, drawing and creative expression",
      category: "ARTS" as const,
      ageMin: 4,
      ageMax: 10,
      locationAddress: createdPartners[3].address,
      city: createdPartners[3].city,
      animalIcon: "panda",
    },
    {
      partnerId: createdPartners[4].id,
      title: "Gymnastics",
      description: "Gymnastics and movement training",
      category: "SPORTS" as const,
      ageMin: 4,
      ageMax: 10,
      locationAddress: createdPartners[4].address,
      city: createdPartners[4].city,
      animalIcon: "bear",
    },
    {
      partnerId: createdPartners[4].id,
      title: "Bouldering",
      description: "Indoor climbing for young adventurers",
      category: "OUTDOOR" as const,
      ageMin: 6,
      ageMax: 14,
      locationAddress: createdPartners[4].address,
      city: createdPartners[4].city,
      animalIcon: "bear",
    },
  ];

  const createdActivities = [];
  for (const activityData of activities) {
    const activity = await prisma.activity.upsert({
      where: { id: activityData.title.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: {
        id: activityData.title.toLowerCase().replace(/\s+/g, "-"),
        ...activityData,
      },
    });
    createdActivities.push(activity);
    console.log("✅ Created activity:", activity.title);
  }

  // Create sessions for the next 4 weeks
  const sessionsToCreate = [];
  for (const activity of createdActivities) {
    for (let week = 0; week < 4; week++) {
      for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + week * 7 + dayOffset + 1);
        startDate.setHours(14 + dayOffset, 0, 0, 0);

        const endDate = new Date(startDate);
        endDate.setHours(startDate.getHours() + 1);

        sessionsToCreate.push({
          activityId: activity.id,
          startDateTime: startDate,
          endDateTime: endDate,
          capacity: 10,
        });
      }
    }
  }

  await prisma.session_.createMany({
    data: sessionsToCreate,
    skipDuplicates: true,
  });
  console.log(`✅ Created ${sessionsToCreate.length} sessions`);

  console.log("\n🎉 Seed completed successfully!");
  console.log("\n📝 Demo credentials:");
  console.log("   Admin: admin@kidspass.com / admin123");
  console.log("   Parent: emma@example.com / parent123");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

