export const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Products', href: '/products' },
  { label: 'Projects', href: '/projects' },
  { label: 'News', href: '/news' },
  { label: 'Insights', href: '/blog' },
  { label: 'Careers', href: '/careers' },
] as const;

export const FOOTER_LINKS = {
  company: [
    { label: 'About', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
    { label: 'Request a Quote', href: '/request-a-quote' },
  ],
  services: [
    { label: 'Web Development', href: '/services/web-development' },
    { label: 'Mobile Development', href: '/services/mobile-app-development' },
    { label: 'Software Development', href: '/services/software-development' },
    { label: 'UI/UX Design', href: '/services/ui-ux-design' },
    { label: 'Digital Solutions', href: '/services/digital-solutions' },
  ],
  resources: [
    { label: 'Blog', href: '/blog' },
    { label: 'News', href: '/news' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Projects', href: '/projects' },
    { label: 'Products', href: '/products' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookie-policy' },
  ],
} as const;

export const SERVICES = [
  {
    slug: 'web-development',
    title: 'Web Development',
    icon: 'Globe',
    shortDescription:
      'High-performance websites and web applications built with modern frameworks and best practices.',
    description:
      'We build fast, accessible, and scalable web applications using modern technologies. From marketing sites to complex dashboards, our web solutions are engineered for performance, SEO, and long-term maintainability.',
    benefits: [
      'Lightning-fast load times',
      'SEO-optimized architecture',
      'Responsive on all devices',
      'Accessible by design',
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
  },
  {
    slug: 'mobile-app-development',
    title: 'Mobile Application Development',
    icon: 'Smartphone',
    shortDescription:
      'Native and cross-platform mobile apps that deliver exceptional user experiences on iOS and Android.',
    description:
      'We create mobile applications that users love. Whether native or cross-platform, our apps are designed for performance, reliability, and seamless updates. We handle everything from architecture to app store deployment.',
    benefits: [
      'Cross-platform compatibility',
      'Offline-first architecture',
      'Push notifications',
      'App store deployment',
    ],
    technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
  },
  {
    slug: 'software-development',
    title: 'Software Development',
    icon: 'Code2',
    shortDescription:
      'Custom software solutions tailored to your business processes and operational needs.',
    description:
      'From internal tools to enterprise platforms, we build software that solves real business problems. Our development process emphasizes clean architecture, thorough testing, and maintainable code.',
    benefits: [
      'Custom architecture design',
      'API development & integration',
      'Automated testing',
      'Long-term maintainability',
    ],
    technologies: ['Node.js', 'Python', 'PostgreSQL', 'Docker'],
  },
  {
    slug: 'ui-ux-design',
    title: 'UI/UX Design',
    icon: 'Palette',
    shortDescription:
      'User-centered design that balances aesthetics with usability and conversion.',
    description:
      'We design interfaces that are both beautiful and functional. Our design process starts with user research and ends with pixel-perfect, accessible, and conversion-optimized interfaces.',
    benefits: [
      'User research & personas',
      'Wireframing & prototyping',
      'Design system creation',
      'Accessibility compliance',
    ],
    technologies: ['Figma', 'Framer', 'Design Systems', 'Prototyping'],
  },
  {
    slug: 'digital-solutions',
    title: 'Custom Digital Solutions',
    icon: 'Boxes',
    shortDescription:
      'End-to-end digital transformation strategies tailored to your industry and goals.',
    description:
      'Every business is unique. We work with you to understand your challenges and design digital solutions that fit. From process automation to platform integration, we help you navigate digital transformation.',
    benefits: [
      'Digital transformation strategy',
      'Process automation',
      'System integration',
      'Scalable architecture',
    ],
    technologies: ['Cloud', 'APIs', 'Automation', 'Microservices'],
  },
  {
    slug: 'business-automation',
    title: 'Business Automation',
    icon: 'Workflow',
    shortDescription:
      'Automate repetitive workflows and free your team to focus on what matters.',
    description:
      'We identify bottlenecks in your operations and build automation that eliminates manual work. From data pipelines to workflow orchestration, we make your business run smoother.',
    benefits: [
      'Workflow automation',
      'Data pipeline integration',
      'Reporting dashboards',
      'Reduced operational costs',
    ],
    technologies: ['n8n', 'Zapier', 'Custom APIs', 'Cron'],
  },
  {
    slug: 'data-technology-solutions',
    title: 'Data & Technology Solutions',
    icon: 'Database',
    shortDescription:
      'Turn your data into actionable insights with robust data infrastructure and analytics.',
    description:
      'We build data infrastructure that scales. From database design to analytics dashboards, we help you collect, store, and understand your data so you can make informed decisions.',
    benefits: [
      'Database architecture',
      'Analytics dashboards',
      'Data pipeline design',
      'Real-time reporting',
    ],
    technologies: ['PostgreSQL', 'BigQuery', 'Metabase', 'dbt'],
  },
  {
    slug: 'it-consulting',
    title: 'IT Consulting',
    icon: 'Lightbulb',
    shortDescription:
      'Strategic technology guidance to help you make the right decisions for your business.',
    description:
      'Not sure where to start? We provide technology consulting to help you make informed decisions. From tech stack selection to architecture review, we guide you toward solutions that fit your needs and budget.',
    benefits: [
      'Technology stack assessment',
      'Architecture review',
      'Digital strategy roadmap',
      'Team augmentation',
    ],
    technologies: ['Cloud', 'DevOps', 'Security', 'Architecture'],
  },
  {
    slug: 'digital-transformation',
    title: 'Digital Transformation',
    icon: 'Rocket',
    shortDescription:
      'Modernize legacy systems and embrace digital-first operations across your organization.',
    description:
      'Digital transformation is more than technology — it is about rethinking how your business operates. We help you modernize legacy systems, adopt cloud infrastructure, and build a culture of continuous improvement.',
    benefits: [
      'Legacy system modernization',
      'Cloud migration',
      'Process digitization',
      'Change management',
    ],
    technologies: ['Cloud', 'Microservices', 'CI/CD', 'Kubernetes'],
  },
] as const;

export const APPROACH_STEPS = [
  {
    number: '01',
    title: 'Discover',
    description:
      'We dive deep into your business, users, and goals to understand the problem before proposing a solution.',
  },
  {
    number: '02',
    title: 'Plan',
    description:
      'We define the architecture, technology stack, timeline, and milestones that will guide the project.',
  },
  {
    number: '03',
    title: 'Design',
    description:
      'We craft intuitive interfaces and user experiences, validated through prototyping and feedback.',
  },
  {
    number: '04',
    title: 'Build',
    description:
      'We develop with clean, tested, and maintainable code — shipping in iterative increments.',
  },
  {
    number: '05',
    title: 'Test',
    description:
      'We rigorously test across devices, edge cases, and performance benchmarks to ensure reliability.',
  },
  {
    number: '06',
    title: 'Launch',
    description:
      'We deploy with confidence, monitor closely, and ensure a smooth go-live for your users.',
  },
  {
    number: '07',
    title: 'Improve',
    description:
      'We iterate based on real user data, continuously refining and enhancing the product.',
  },
] as const;

export const WHY_KEZERA = [
  {
    icon: 'Brain',
    title: 'Technology-First Thinking',
    description:
      'We approach every problem through an engineering lens, choosing the right technology for the job rather than forcing a single solution.',
  },
  {
    icon: 'Users',
    title: 'User-Centered Design',
    description:
      'Every decision starts with the user. We design experiences that are intuitive, accessible, and genuinely useful.',
  },
  {
    icon: 'Wrench',
    title: 'Custom Solutions',
    description:
      'No templates, no shortcuts. We build solutions tailored to your specific needs, processes, and goals.',
  },
  {
    icon: 'Layers',
    title: 'Scalable Architecture',
    description:
      'We engineer for growth from day one, so your product can scale from hundreds to millions without rebuilding.',
  },
  {
    icon: 'ShieldCheck',
    title: 'Reliable Development',
    description:
      'Thorough testing, code review, and quality standards ensure the software we ship is dependable.',
  },
  {
    icon: 'Handshake',
    title: 'Long-Term Partnership',
    description:
      'We are not a one-and-done shop. We invest in relationships and support your product well beyond launch.',
  },
  {
    icon: 'TrendingUp',
    title: 'Continuous Improvement',
    description:
      'Software is never finished. We iterate based on data, feedback, and evolving business needs.',
  },
] as const;

export const INDUSTRIES = [
  { name: 'Construction', icon: 'Building2' },
  { name: 'Education', icon: 'GraduationCap' },
  { name: 'Healthcare', icon: 'HeartPulse' },
  { name: 'Retail', icon: 'ShoppingCart' },
  { name: 'Finance', icon: 'Landmark' },
  { name: 'Manufacturing', icon: 'Factory' },
  { name: 'Fitness', icon: 'Dumbbell' },
  { name: 'Professional Services', icon: 'Briefcase' },
  { name: 'Startups', icon: 'Rocket' },
  { name: 'Small & Medium Businesses', icon: 'Store' },
] as const;

export const TECH_CATEGORIES = [
  {
    category: 'Frontend',
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    category: 'Backend',
    technologies: ['Node.js', 'Python', 'PostgreSQL', 'GraphQL'],
  },
  {
    category: 'Mobile',
    technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
  },
  {
    category: 'Cloud',
    technologies: ['AWS', 'Vercel', 'Docker', 'Kubernetes'],
  },
  {
    category: 'DevOps',
    technologies: ['GitHub Actions', 'CI/CD', 'Terraform', 'Monitoring'],
  },
  {
    category: 'Design',
    technologies: ['Figma', 'Framer', 'Design Systems', 'Prototyping'],
  },
  {
    category: 'AI / Automation',
    technologies: ['OpenAI', 'LangChain', 'n8n', 'Vector DBs'],
  },
] as const;
