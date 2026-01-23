const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Check if data already exists
  const existingProjects = await prisma.project.count();
  if (existingProjects > 0) {
    console.log('Database already contains data. Skipping seeding.');
    return;
  }

  console.log('Database is empty. Seeding initial data...');

  // Create default admin user
  const bcrypt = require('/usr/local/lib/node_modules/bcryptjs');
  const hashedPassword = await bcrypt.hash('admin123', 12);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@modeleuropa.com' },
    update: {},
    create: {
      email: 'admin@modeleuropa.com',
      name: 'Model Europa Admin',
      password: hashedPassword,
    },
  });

  console.log('Created admin user:', adminUser.email);

  // Create sample projects with images
  const projects = [
    {
      title: "Urban Architecture",
      category: "Photography",
      description: "Capturing the geometric beauty of modern cityscapes through architectural photography, emphasizing the interplay of light, shadow, and urban form.",
      year: "2023",
      images: {
        create: [
          {
            filename: "urban-architecture-1.jpg",
            originalName: "urban-architecture-1.jpg",
            url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
            isPrimary: true,
            order: 0,
          }
        ]
      }
    },
    {
      title: "Minimalist Branding",
      category: "Design",
      description: "A complete visual identity overhaul for a boutique design agency, featuring clean typography, monochromatic palettes, and sophisticated brand guidelines.",
      year: "2024",
      images: {
        create: [
          {
            filename: "minimalist-branding-1.jpg",
            originalName: "minimalist-branding-1.jpg",
            url: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2074&auto=format&fit=crop",
            isPrimary: true,
            order: 0,
          }
        ]
      }
    },
    {
      title: "Sustainable Living",
      category: "Architecture",
      description: "Contemporary eco-friendly residential design featuring passive solar heating, rainwater harvesting, and sustainable materials in perfect harmony with nature.",
      year: "2024",
      images: {
        create: [
          {
            filename: "sustainable-living-1.jpg",
            originalName: "sustainable-living-1.jpg",
            url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
            isPrimary: true,
            order: 0,
          },
          {
            filename: "sustainable-living-2.jpg",
            originalName: "sustainable-living-2.jpg",
            url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
            isPrimary: false,
            order: 1,
          }
        ]
      }
    },
    {
      title: "Luxury Brand Campaign",
      category: "Commercial",
      description: "Prestigious luxury fashion campaign featuring high-end product photography, lifestyle storytelling, and sophisticated visual composition that captures the essence of elegance and exclusivity.",
      year: "2024",
      images: {
        create: [
          {
            filename: "luxury-campaign-1.jpg",
            originalName: "luxury-campaign-1.jpg",
            url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
            isPrimary: true,
            order: 0,
          }
        ]
      }
    },
    {
      title: "Abstract Digital Art",
      category: "Fine Art",
      description: "Bold contemporary digital art series exploring the intersection of technology and emotion, created through advanced digital manipulation and algorithmic composition techniques.",
      year: "2023",
      images: {
        create: [
          {
            filename: "abstract-digital-1.jpg",
            originalName: "abstract-digital-1.jpg",
            url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop",
            isPrimary: true,
            order: 0,
          }
        ]
      }
    },
    {
      title: "Modern Workspace Design",
      category: "Architecture",
      description: "Innovative office space design combining ergonomic principles with aesthetic excellence, featuring collaborative areas, natural lighting, and technology integration for enhanced productivity.",
      year: "2024",
      images: {
        create: [
          {
            filename: "workspace-design-1.jpg",
            originalName: "workspace-design-1.jpg",
            url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
            isPrimary: true,
            order: 0,
          }
        ]
      }
    }
  ];

  console.log('Start seeding...');

  for (const projectData of projects) {
    const project = await prisma.project.create({
      data: projectData,
      include: {
        images: true
      }
    });
    console.log(`Created project with id: ${project.id} (${project.images.length} images)`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });