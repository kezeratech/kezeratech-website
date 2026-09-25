import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kezeratech.com';
  const lastModified = new Date();

  const staticPages = [
    { path: '',                  priority: 1.0,  freq: 'weekly'  },
    { path: '/about',            priority: 0.8,  freq: 'monthly' },
    { path: '/services',         priority: 0.9,  freq: 'monthly' },
    { path: '/projects',         priority: 0.9,  freq: 'monthly' },
    { path: '/products',         priority: 0.8,  freq: 'monthly' },
    { path: '/industries',       priority: 0.7,  freq: 'monthly' },
    { path: '/blog',             priority: 0.9,  freq: 'weekly'  },
    { path: '/news',             priority: 0.9,  freq: 'weekly'  },
    { path: '/careers',          priority: 0.7,  freq: 'weekly'  },
    { path: '/contact',          priority: 0.8,  freq: 'monthly' },
    { path: '/request-a-quote',  priority: 0.8,  freq: 'monthly' },
    { path: '/faq',              priority: 0.6,  freq: 'monthly' },
    { path: '/privacy',          priority: 0.3,  freq: 'yearly'  },
    { path: '/cookie-policy',    priority: 0.3,  freq: 'yearly'  },
    { path: '/terms',            priority: 0.3,  freq: 'yearly'  },
  ] as const;

  const staticEntries: MetadataRoute.Sitemap = staticPages.map(({ path, priority, freq }) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency: freq as MetadataRoute.Sitemap[number]['changeFrequency'],
    priority,
  }));

  // Fetch dynamic slugs using the Supabase REST API directly
  // (avoids webpack warning from importing Supabase in server context)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return staticEntries;

  try {
    const headers = {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    };

    const [servicesRes, projectsRes, productsRes, blogsRes, newsRes] = await Promise.all([
      fetch(`${supabaseUrl}/rest/v1/services?select=slug,updated_at&is_published=eq.true`, { headers }),
      fetch(`${supabaseUrl}/rest/v1/projects?select=slug,updated_at&is_published=eq.true`, { headers }),
      fetch(`${supabaseUrl}/rest/v1/products?select=slug,updated_at&is_published=eq.true`, { headers }),
      fetch(`${supabaseUrl}/rest/v1/blog_posts?select=slug,updated_at&is_published=eq.true`, { headers }),
      fetch(`${supabaseUrl}/rest/v1/news?select=slug,updated_at&is_published=eq.true`, { headers }),
    ]);

    const [services, projects, products, blogs, news] = await Promise.all([
      servicesRes.ok ? servicesRes.json() : [],
      projectsRes.ok ? projectsRes.json() : [],
      productsRes.ok ? productsRes.json() : [],
      blogsRes.ok ? blogsRes.json() : [],
      newsRes.ok ? newsRes.json() : [],
    ]);

    const dynamicEntries: MetadataRoute.Sitemap = [
      ...services.map((s: { slug: string; updated_at: string }) => ({
        url: `${baseUrl}/services/${s.slug}`,
        lastModified: s.updated_at ? new Date(s.updated_at) : lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
      ...projects.map((p: { slug: string; updated_at: string }) => ({
        url: `${baseUrl}/projects/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
      ...products.map((p: { slug: string; updated_at: string }) => ({
        url: `${baseUrl}/products/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
      ...blogs.map((b: { slug: string; updated_at: string }) => ({
        url: `${baseUrl}/blog/${b.slug}`,
        lastModified: b.updated_at ? new Date(b.updated_at) : lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
      ...news.map((n: { slug: string; updated_at: string }) => ({
        url: `${baseUrl}/news/${n.slug}`,
        lastModified: n.updated_at ? new Date(n.updated_at) : lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
    ];

    return [...staticEntries, ...dynamicEntries];
  } catch {
    return staticEntries;
  }
}
