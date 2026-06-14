import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  author: string;
  published: boolean;
  createdAt?: string;
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('id, title, slug, excerpt, content, image_url, author, published, created_at')
          .eq('slug', slug)
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          const blogData: BlogPost = {
            id: data.id,
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            content: data.content,
            imageUrl: data.image_url,
            author: data.author,
            published: data.published,
            createdAt: data.created_at,
          };
          setBlog(blogData);

          // Update SEO Title & Meta Description dynamically
          document.title = `${blogData.title} | SS Clinic`;
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) {
            metaDesc.setAttribute("content", blogData.excerpt || "Read this health blog from SS Clinic.");
          }
        } else {
          // Blog not found
          navigate('/blogs');
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-16 flex justify-center">
        <div className="animate-pulse w-full max-w-4xl px-4">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-12"></div>
          <div className="h-64 bg-gray-200 rounded w-full mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <article className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/blogs" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-8 transition-colors">
          <ArrowLeft size={20} /> Back to all blogs
        </Link>
        
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <User size={18} className="text-blue-500" />
              <span className="font-medium text-gray-800">{blog.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-blue-500" />
              <span>
                {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
              </span>
            </div>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-3 py-1.5 rounded-full"
            >
              <Share2 size={16} /> Share
            </button>
          </div>
        </header>

        {blog.imageUrl && (
          <div className="mb-12 rounded-3xl overflow-hidden shadow-xl">
            <img src={blog.imageUrl} alt={blog.title} className="w-full h-auto max-h-[500px] object-cover" />
          </div>
        )}

        <div 
          className="prose prose-lg prose-blue max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </article>
  );
}
