import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl?: string;
  author: string;
  published: boolean;
  createdAt?: { toDate: () => Date };
}

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Health Blogs | SS Clinic Kudlu";
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Read the latest health tips, medical news, and updates from the expert doctors at SS Clinic in Kudlu, Bangalore.");
    }

    const fetchBlogs = async () => {
      try {
        const q = query(
          collection(db, 'blogs'),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const blogsData = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() as Omit<Blog, 'id'> }))
          .filter(blog => blog.published === true);
        setBlogs(blogsData);
      } catch (error) {
        console.error("Error fetching blogs: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Our Health Blogs</h1>
          <p className="text-xl text-gray-600">Expert medical insights, health tips, and clinic updates from the doctors at SS Clinic.</p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl h-[400px] shadow-sm border border-gray-100"></div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No blogs found. Please check back later!</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map(blog => (
              <article key={blog.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
                <Link to={`/blogs/${blog.slug}`} className="block relative h-56 overflow-hidden">
                  {blog.imageUrl ? (
                    <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-200">
                      <span className="text-4xl font-bold opacity-30">SS Clinic</span>
                    </div>
                  )}
                </Link>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-blue-500" />
                      <span>{blog.createdAt?.toDate ? blog.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User size={14} className="text-blue-500" />
                      <span>{blog.author}</span>
                    </div>
                  </div>
                  <Link to={`/blogs/${blog.slug}`}>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">{blog.title}</h2>
                  </Link>
                  <p className="text-gray-600 mb-6 line-clamp-3 flex-1">{blog.excerpt}</p>
                  <Link to={`/blogs/${blog.slug}`} className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors mt-auto">
                    Read Article <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
