import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';

export default function LatestBlogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(
          collection(db, 'blogs'),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const blogsData = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() as any }))
          .filter(blog => blog.published === true)
          .slice(0, 2);
        setBlogs(blogsData);
      } catch (error) {
        console.error("Error fetching latest blogs: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (isLoading || blogs.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50" id="latest-updates">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Health Updates</h2>
            <p className="text-gray-600 max-w-2xl text-lg">
              Read our latest articles, health tips, and clinic news written by our expert doctors.
            </p>
          </div>
          <Link to="/blogs" className="hidden md:inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors">
            View All Blogs <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {blogs.map(blog => (
            <article key={blog.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col sm:flex-row">
              <Link to={`/blogs/${blog.slug}`} className="sm:w-2/5 relative h-48 sm:h-auto overflow-hidden shrink-0">
                {blog.imageUrl ? (
                  <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-200">
                    <span className="text-xl font-bold opacity-30">SS Clinic</span>
                  </div>
                )}
              </Link>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Calendar size={14} className="text-blue-500" />
                  <span>{blog.createdAt?.toDate ? blog.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
                </div>
                <Link to={`/blogs/${blog.slug}`}>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{blog.title}</h3>
                </Link>
                <p className="text-gray-600 mb-4 line-clamp-2 text-sm flex-1">{blog.excerpt}</p>
                <Link to={`/blogs/${blog.slug}`} className="inline-flex items-center gap-1.5 text-blue-600 font-medium hover:text-blue-800 transition-colors mt-auto text-sm">
                  Read More <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link to="/blogs" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors">
            View All Blogs <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
