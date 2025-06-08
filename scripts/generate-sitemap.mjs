import fs from 'fs';
import path from 'path';
import { getBlogPosts } from '../src/lib/blog.js';
import { getAllProjects } from '../src/lib/projects.js';

async function generateSitemap() {
  const URL = 'https://mohammeda.li';

  const posts = getBlogPosts().map(({ slug }) => ({
    url: `${URL}/blog/${slug}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  const projects = getAllProjects().map(({ slug }) => ({
    url: `${URL}/projects/${slug}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  const routes = ['', '/about', '/blog', '/projects'].map((route) => ({
    url: `${URL}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  const allUrls = [...routes, ...posts, ...projects];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
    .map(({ url, lastModified }) => {
      return `
    <url>
      <loc>${url}</loc>
      <lastmod>${lastModified}</lastmod>
    </url>
  `;
    })
    .join('')}
</urlset>`;

  const publicPath = path.join(process.cwd(), 'public');
  fs.writeFileSync(path.join(publicPath, 'sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully!');
}

generateSitemap();
