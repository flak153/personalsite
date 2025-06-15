import Link from 'next/link';
import { BlogPost } from '@/lib/blog';

interface BlogSectionProps {
  featuredPost: BlogPost | null;
  recentPosts: BlogPost[];
  allPosts: BlogPost[];
}

export default function BlogSection({ featuredPost, recentPosts, allPosts }: BlogSectionProps) {
  return (
    <section className="relative py-16 px-8 md:px-16 z-10" id="blog" aria-labelledby="blog-heading">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 id="blog-heading" className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-geist-sans)] drop-shadow-[0_0_8px_rgba(0,0,0,0.6)]">
            Latest Posts
          </h2>
          <Link 
            href="/blog" 
            className="text-yellow-300 hover:text-yellow-100 flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-transparent rounded px-2 py-1"
            aria-label="View all blog posts"
          >
            <span>View all</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
        <div className="space-y-6">
          {/* Featured post */}
          {featuredPost && (
            <article className="border border-white/40 rounded-lg p-6 hover:border-white hover:shadow-lg transition-all bg-black/20 backdrop-blur-sm hover:scale-105">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-2">
                  <time className="text-white/90 font-medium" dateTime={featuredPost.date}>{featuredPost.date}</time>
                  {featuredPost.readTime && <span className="text-white/50" aria-hidden="true">•</span>}
                  {featuredPost.readTime && <span className="text-white/70 text-sm">{featuredPost.readTime}</span>}
                </div>
                {featuredPost.category && <span className="bg-white/20 px-3 py-1 rounded-full text-xs text-white" role="img" aria-label={`Category: ${featuredPost.category}`}>{featuredPost.category}</span>}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white hover:text-yellow-200 transition-colors">
                <Link 
                  href={`/blog/${featuredPost.slug}`} 
                  className="focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-transparent rounded"
                  aria-label={`Read article: ${featuredPost.title}`}
                >
                  {featuredPost.title}
                </Link>
              </h3>
              {featuredPost.excerpt && <p className="text-white/80 mb-4">{featuredPost.excerpt}</p>}
              <div className="pt-2">
                <Link 
                  href={`/blog/${featuredPost.slug}`} 
                  className="text-yellow-300 hover:text-yellow-100 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-transparent rounded px-2 py-1"
                  aria-label={`Continue reading ${featuredPost.title}`}
                >
                  Read more →
                </Link>
              </div>
            </article>
          )}
          
          {/* Recent posts in a row */}
          {recentPosts.length > 0 && (
            <div className="grid gap-6 md:grid-cols-3" role="list" aria-label="Recent blog posts">
              {recentPosts.map((post) => (
                <article key={post.slug} className="border border-white/40 rounded-lg p-4 hover:border-white hover:shadow-lg transition-all bg-black/10 backdrop-blur-sm hover:scale-105" role="listitem">
                  <div className="flex justify-between items-center mb-2">
                    <time className="text-white/70 text-sm" dateTime={post.date}>{post.date}</time>
                    {post.category && <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs text-white" role="img" aria-label={`Category: ${post.category}`}>{post.category}</span>}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white hover:text-yellow-200 transition-colors">
                    <Link 
                      href={`/blog/${post.slug}`} 
                      className="focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-transparent rounded"
                      aria-label={`Read article: ${post.title}`}
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <Link 
                    href={`/blog/${post.slug}`} 
                    className="text-yellow-300 hover:text-yellow-100 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-transparent rounded px-2 py-1"
                    aria-label={`Continue reading ${post.title}`}
                  >
                    Read more →
                  </Link>
                </article>
              ))}
            </div>
          )}

          {allPosts.length === 0 && (
            <div className="border border-white/40 rounded-lg p-6 bg-black/10 backdrop-blur-sm">
              <p className="text-white/80 text-lg">No blog posts yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
