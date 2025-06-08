import { getBlogPosts } from '@/lib/blog';
import { getFeaturedProjects } from '@/lib/projects';
import HomePageContent from './HomePageContent';

export default function Home() {
  const allPosts = getBlogPosts();
  const featuredProjects = getFeaturedProjects();
  const featuredPost = allPosts.length > 0 ? allPosts[0] : null;
  const recentPosts = allPosts.length > 1 ? allPosts.slice(1, 4) : []; // Get next 3 posts, or fewer if not available

  return (
    <HomePageContent 
      allPosts={allPosts}
      featuredProjects={featuredProjects}
      featuredPost={featuredPost}
      recentPosts={recentPosts}
    />
  );
}
