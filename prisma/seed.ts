import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create kid-friendly plans
  const plans = [
    {
      code: "LITTLE_EXPLORER",
      name: "Little Explorer 🌱",
      description: "Perfect for trying out new activities! 4 adventures per month.",
      priceCents: 1900,
      currency: "EUR",
      creditsPerPeriod: 4,
      emoji: "🌱",
    },
    {
      code: "SUPER_STAR",
      name: "Super Star ⭐",
      description: "For curious kids who want more! 8 adventures per month.",
      priceCents: 2900,
      currency: "EUR",
      creditsPerPeriod: 8,
      emoji: "⭐",
    },
    {
      code: "UNLIMITED_FUN",
      name: "Unlimited Fun 🚀",
      description: "The sky's the limit! Unlimited adventures every month.",
      priceCents: 4900,
      currency: "EUR",
      creditsPerPeriod: 99,
      emoji: "🚀",
    },
  ];

  const createdPlans = [];
  for (const planData of plans) {
    const plan = await prisma.plan.upsert({
      where: { code: planData.code },
      update: planData,
      create: {
        ...planData,
        period: "MONTHLY",
        isActive: true,
      },
    });
    createdPlans.push(plan);
    console.log("✅ Created plan:", plan.name);
  }

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
      city: "Hamburg",
    },
  });
  console.log("✅ Created admin user:", admin.email);

  // Create demo parent user (Munich)
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

  // Create subscription for demo parent (Super Star plan)
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  await prisma.subscription.upsert({
    where: { userId: parent.id },
    update: {
      planId: createdPlans[1].id, // Super Star
      status: "ACTIVE",
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
    },
    create: {
      userId: parent.id,
      planId: createdPlans[1].id, // Super Star
      status: "ACTIVE",
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
    },
  });
  console.log("✅ Created subscription for demo parent (Super Star plan)");

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

  // Create partners for both Munich and Hamburg
  const partners = [
    // Munich Partners
    {
      id: "city-soccer-club-munich",
      name: "City Soccer Club",
      description: "Premier youth soccer training facility in Munich",
      address: "450 Bay Street",
      city: "Munich",
      postcode: "80331",
      contactEmail: "info@citysoccer.de",
    },
    {
      id: "playground-sports-munich",
      name: "Playground Sports",
      description: "Multi-sport facility for kids of all ages",
      address: "123 Sports Avenue",
      city: "Munich",
      postcode: "80333",
      contactEmail: "hello@playgroundsports.de",
    },
    {
      id: "harmony-music-school-munich",
      name: "Harmony Music School",
      description: "Expert music education for young learners",
      address: "78 Music Lane",
      city: "Munich",
      postcode: "80336",
      contactEmail: "contact@harmonymusic.de",
    },
    {
      id: "creative-kids-studio-munich",
      name: "Creative Kids Studio",
      description: "Art and creativity workshops for children",
      address: "55 Art Street",
      city: "Munich",
      postcode: "80339",
      contactEmail: "info@creativekids.de",
    },
    {
      id: "climbing-gym-munich",
      name: "Climbing Gym",
      description: "Indoor climbing and bouldering for kids",
      address: "200 Boulder Road",
      city: "Munich",
      postcode: "80335",
      contactEmail: "climb@climbinggym.de",
    },
    // Hamburg Partners
    {
      id: "hsv-fussballschule",
      name: "HSV Fußballschule",
      description: "Official HSV youth soccer academy in Hamburg",
      address: "Sylvesterallee 7",
      city: "Hamburg",
      postcode: "22525",
      contactEmail: "fussballschule@hsv.de",
    },
    {
      id: "kaifu-lodge-hamburg",
      name: "Kaifu-Lodge",
      description: "Premium sports center with swimming and fitness for kids",
      address: "Bundesstraße 107",
      city: "Hamburg",
      postcode: "20144",
      contactEmail: "info@kaifu-lodge.de",
    },
    {
      id: "stage-school-hamburg",
      name: "Stage School Hamburg",
      description: "Dance, music and performing arts for young talents",
      address: "Hongkongstraße 7",
      city: "Hamburg",
      postcode: "20457",
      contactEmail: "info@stageschool.de",
    },
    {
      id: "miniatur-wunderland-kids",
      name: "MiniKids Workshop",
      description: "Creative building and craft workshops for children",
      address: "Kehrwieder 2",
      city: "Hamburg",
      postcode: "20457",
      contactEmail: "kids@miniatur-wunderland.de",
    },
    {
      id: "nordwand-hamburg",
      name: "Nordwandhalle",
      description: "Indoor climbing and bouldering paradise for kids",
      address: "Kieler Straße 575",
      city: "Hamburg",
      postcode: "22525",
      contactEmail: "info@nordwandhalle.de",
    },
    {
      id: "musikschule-hamburg",
      name: "Staatliche Jugendmusikschule",
      description: "Classical and modern music education for children",
      address: "Mittelweg 42",
      city: "Hamburg",
      postcode: "20148",
      contactEmail: "info@jugendmusikschule.de",
    },
  ];

  const createdPartners: Record<string, typeof partners[0] & { id: string }> = {};
  for (const partnerData of partners) {
    const partner = await prisma.partner.upsert({
      where: { id: partnerData.id },
      update: {},
      create: partnerData,
    });
    createdPartners[partner.id] = partner;
    console.log("✅ Created partner:", partner.name, `(${partner.city})`);
  }

  // Create activities for both cities
  const activities = [
    // Munich Activities
    {
      id: "soccer-munich",
      partnerId: "city-soccer-club-munich",
      title: "Soccer",
      description: "Learn soccer fundamentals and teamwork skills",
      category: "SPORTS" as const,
      ageMin: 6,
      ageMax: 12,
      locationAddress: "450 Bay Street",
      city: "Munich",
      animalIcon: "rabbit",
    },
    {
      id: "basketball-munich",
      partnerId: "playground-sports-munich",
      title: "Basketball",
      description: "Fun basketball training for beginners",
      category: "SPORTS" as const,
      ageMin: 7,
      ageMax: 14,
      locationAddress: "123 Sports Avenue",
      city: "Munich",
      animalIcon: "fox",
    },
    {
      id: "piano-munich",
      partnerId: "harmony-music-school-munich",
      title: "Piano",
      description: "Individual and group piano lessons",
      category: "MUSIC" as const,
      ageMin: 5,
      ageMax: 12,
      locationAddress: "78 Music Lane",
      city: "Munich",
      animalIcon: "dog",
    },
    {
      id: "art-class-munich",
      partnerId: "creative-kids-studio-munich",
      title: "Art Class",
      description: "Painting, drawing and creative expression",
      category: "ARTS" as const,
      ageMin: 4,
      ageMax: 10,
      locationAddress: "55 Art Street",
      city: "Munich",
      animalIcon: "panda",
    },
    {
      id: "gymnastics-munich",
      partnerId: "climbing-gym-munich",
      title: "Gymnastics",
      description: "Gymnastics and movement training",
      category: "SPORTS" as const,
      ageMin: 4,
      ageMax: 10,
      locationAddress: "200 Boulder Road",
      city: "Munich",
      animalIcon: "bear",
    },
    {
      id: "bouldering-munich",
      partnerId: "climbing-gym-munich",
      title: "Bouldering",
      description: "Indoor climbing for young adventurers",
      category: "OUTDOOR" as const,
      ageMin: 6,
      ageMax: 14,
      locationAddress: "200 Boulder Road",
      city: "Munich",
      animalIcon: "bear",
    },
    // Hamburg Activities
    {
      id: "fussball-hamburg",
      partnerId: "hsv-fussballschule",
      title: "Fußball Training",
      description: "Professional soccer training at HSV academy",
      category: "SPORTS" as const,
      ageMin: 5,
      ageMax: 14,
      locationAddress: "Sylvesterallee 7",
      city: "Hamburg",
      animalIcon: "fox",
    },
    {
      id: "schwimmen-hamburg",
      partnerId: "kaifu-lodge-hamburg",
      title: "Schwimmkurs",
      description: "Swimming lessons for all skill levels",
      category: "SWIMMING" as const,
      ageMin: 4,
      ageMax: 12,
      locationAddress: "Bundesstraße 107",
      city: "Hamburg",
      animalIcon: "rabbit",
    },
    {
      id: "tanzen-hamburg",
      partnerId: "stage-school-hamburg",
      title: "Hip Hop Dance",
      description: "Fun and energetic hip hop classes for kids",
      category: "DANCE" as const,
      ageMin: 6,
      ageMax: 14,
      locationAddress: "Hongkongstraße 7",
      city: "Hamburg",
      animalIcon: "panda",
    },
    {
      id: "ballett-hamburg",
      partnerId: "stage-school-hamburg",
      title: "Ballet",
      description: "Classical ballet training for young dancers",
      category: "DANCE" as const,
      ageMin: 4,
      ageMax: 12,
      locationAddress: "Hongkongstraße 7",
      city: "Hamburg",
      animalIcon: "rabbit",
    },
    {
      id: "basteln-hamburg",
      partnerId: "miniatur-wunderland-kids",
      title: "Kreativ Workshop",
      description: "Building, crafting and creative projects",
      category: "CREATIVE" as const,
      ageMin: 5,
      ageMax: 12,
      locationAddress: "Kehrwieder 2",
      city: "Hamburg",
      animalIcon: "bear",
    },
    {
      id: "malen-hamburg",
      partnerId: "miniatur-wunderland-kids",
      title: "Malkurs",
      description: "Painting and art classes for kids",
      category: "ARTS" as const,
      ageMin: 4,
      ageMax: 10,
      locationAddress: "Kehrwieder 2",
      city: "Hamburg",
      animalIcon: "dog",
    },
    {
      id: "klettern-hamburg",
      partnerId: "nordwand-hamburg",
      title: "Klettern für Kids",
      description: "Indoor climbing adventures for children",
      category: "OUTDOOR" as const,
      ageMin: 6,
      ageMax: 14,
      locationAddress: "Kieler Straße 575",
      city: "Hamburg",
      animalIcon: "bear",
    },
    {
      id: "bouldern-hamburg",
      partnerId: "nordwand-hamburg",
      title: "Bouldern",
      description: "Beginner-friendly bouldering sessions",
      category: "OUTDOOR" as const,
      ageMin: 5,
      ageMax: 12,
      locationAddress: "Kieler Straße 575",
      city: "Hamburg",
      animalIcon: "fox",
    },
    {
      id: "gitarre-hamburg",
      partnerId: "musikschule-hamburg",
      title: "Gitarrenunterricht",
      description: "Guitar lessons for beginners and intermediate",
      category: "MUSIC" as const,
      ageMin: 6,
      ageMax: 14,
      locationAddress: "Mittelweg 42",
      city: "Hamburg",
      animalIcon: "dog",
    },
    {
      id: "klavier-hamburg",
      partnerId: "musikschule-hamburg",
      title: "Klavierunterricht",
      description: "Piano lessons with experienced teachers",
      category: "MUSIC" as const,
      ageMin: 5,
      ageMax: 14,
      locationAddress: "Mittelweg 42",
      city: "Hamburg",
      animalIcon: "panda",
    },
  ];

  const createdActivities = [];
  for (const activityData of activities) {
    const activity = await prisma.activity.upsert({
      where: { id: activityData.id },
      update: {},
      create: activityData,
    });
    createdActivities.push(activity);
    console.log("✅ Created activity:", activity.title, `(${activity.city})`);
  }

  // Create sessions for the next 4 weeks
  console.log("⏳ Creating sessions...");
  let sessionCount = 0;
  
  for (const activity of createdActivities) {
    for (let week = 0; week < 4; week++) {
      for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + week * 7 + dayOffset + 1);
        startDate.setHours(14 + dayOffset, 0, 0, 0);

        const endDate = new Date(startDate);
        endDate.setHours(startDate.getHours() + 1);

        const sessionId = `${activity.id}-${week}-${dayOffset}`;
        
        await prisma.session_.upsert({
          where: { id: sessionId },
          update: {},
          create: {
            id: sessionId,
            activityId: activity.id,
            startDateTime: startDate,
            endDateTime: endDate,
            capacity: 10,
          },
        });
        sessionCount++;
      }
    }
  }
  console.log(`✅ Created ${sessionCount} sessions`);

  console.log("\n🎉 Seed completed successfully!");
  console.log("\n📝 Demo credentials:");
  console.log("   Admin: admin@kidspass.com / admin123");
  console.log("   Parent: emma@example.com / parent123");
  console.log("\n🏙️ Available cities: Munich, Hamburg");
  console.log("\n💳 Available plans:");
  for (const plan of createdPlans) {
    console.log(`   ${plan.name} - €${plan.priceCents / 100}/month (${plan.creditsPerPeriod} activities)`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
