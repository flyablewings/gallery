import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.image.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create default admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@modeleuropa.com",
      name: "Model Europa Admin",
      password: hashedPassword,
    },
  });
  console.log(`Created admin user: ${adminUser.email}`);

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
          },
          {
            filename: "luxury-campaign-2.jpg",
            originalName: "luxury-campaign-2.jpg",
            url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
            isPrimary: false,
            order: 1,
          },
          {
            filename: "luxury-campaign-3.jpg",
            originalName: "luxury-campaign-3.jpg",
            url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
            isPrimary: false,
            order: 2,
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
          },
          {
            filename: "workspace-design-2.jpg",
            originalName: "workspace-design-2.jpg",
            url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
            isPrimary: false,
            order: 1,
          }
        ]
      }
    },
    {
      title: "Street Photography Series",
      category: "Photography",
      description: "Candid urban life documentation capturing authentic moments in bustling city environments, from street performers to everyday interactions that tell the story of modern urban culture.",
      year: "2023",
      images: {
        create: [
          {
            filename: "street-photography-1.jpg",
            originalName: "street-photography-1.jpg",
            url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=2070&auto=format&fit=crop",
            isPrimary: true,
            order: 0,
          },
          {
            filename: "street-photography-2.jpg",
            originalName: "street-photography-2.jpg",
            url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=2070&auto=format&fit=crop",
            isPrimary: false,
            order: 1,
          }
        ]
      }
    },
    {
      title: "Fintech App Interface",
      category: "Design",
      description: "User-centric financial technology application design focusing on intuitive navigation, data visualization, and secure user experience with modern minimalist aesthetics.",
      year: "2024",
      images: {
        create: [
          {
            filename: "fintech-app-1.jpg",
            originalName: "fintech-app-1.jpg",
            url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
            isPrimary: true,
            order: 0,
          }
        ]
      }
    },
    {
      title: "Culinary Photography",
      category: "Commercial",
      description: "Gourmet food photography for high-end restaurants and publications, showcasing culinary artistry through precise lighting, composition, and attention to texture and presentation.",
      year: "2023",
      images: {
        create: [
          {
            filename: "culinary-photography-1.jpg",
            originalName: "culinary-photography-1.jpg",
            url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop",
            isPrimary: true,
            order: 0,
          },
          {
            filename: "culinary-photography-2.jpg",
            originalName: "culinary-photography-2.jpg",
            url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop",
            isPrimary: false,
            order: 1,
          }
        ]
      }
    },
    {
      title: "Interactive Installation",
      category: "3D Art",
      description: "Immersive interactive art installation combining physical computing, projection mapping, and audience participation to create unique sensory experiences.",
      year: "2024",
      images: {
        create: [
          {
            filename: "interactive-installation-1.jpg",
            originalName: "interactive-installation-1.jpg",
            url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop",
            isPrimary: true,
            order: 0,
          }
        ]
      }
    },
    {
      title: "Boutique Hotel Design",
      category: "Architecture",
      description: "Luxurious boutique hotel interior design blending contemporary elegance with local cultural elements, creating intimate spaces that balance comfort and sophistication.",
      year: "2023",
      images: {
        create: [
          {
            filename: "boutique-hotel-1.jpg",
            originalName: "boutique-hotel-1.jpg",
            url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
            isPrimary: true,
            order: 0,
          },
          {
            filename: "boutique-hotel-2.jpg",
            originalName: "boutique-hotel-2.jpg",
            url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
            isPrimary: false,
            order: 1,
          },
          {
            filename: "boutique-hotel-3.jpg",
            originalName: "boutique-hotel-3.jpg",
            url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
            isPrimary: false,
            order: 2,
          }
        ]
      }
    },
    {
      title: "Portrait Study: Emotions",
      category: "Photography",
      description: "Intimate portrait series exploring the depth of human emotion through carefully crafted lighting, composition, and psychological insight into the human experience.",
      year: "2024",
      images: {
        create: [
          {
            filename: "portrait-emotions-1.jpg",
            originalName: "portrait-emotions-1.jpg",
            url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop",
            isPrimary: true,
            order: 0,
          }
        ]
      }
    },
    {
      title: "Sustainable Packaging",
      category: "Design",
      description: "Eco-conscious packaging design for consumer products, combining functionality with environmental responsibility through innovative materials and minimalist aesthetics.",
      year: "2023",
      images: {
        create: [
          {
            filename: "sustainable-packaging-1.jpg",
            originalName: "sustainable-packaging-1.jpg",
            url: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=2070&auto=format&fit=crop",
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

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });