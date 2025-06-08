import { getBlogPosts, BlogPost } from '../lib/blog';
import { getAllProjects, Project } from '../lib/projects';

const URL = 'https://mohammeda.li';

export default async function sitemap() {
  const posts = getBlogPosts().map(({ slug }: BlogPost) => ({
    url: `${URL}/blog/${slug}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  const projects = getAllProjects().map(({ slug }: Project) => ({
    url: `${URL}/projects/${slug}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  const routes = ['', '/about', '/blog', '/projects'].map((route) => ({
    url: `${URL}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  return [...routes, ...posts, ...projects];
}
