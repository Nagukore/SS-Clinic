import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { db, storage } from '../../firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import { Blog } from './AdminBlogList';

interface AdminBlogFormProps {
  blog: Blog | null;
  onBack: () => void;
  onSuccess: () => void;
}

export default function AdminBlogForm({ blog, onBack, onSuccess }: AdminBlogFormProps) {
  const [title, setTitle] = useState(blog?.title || '');
  const [excerpt, setExcerpt] = useState(blog?.excerpt || '');
  const [content, setContent] = useState(blog?.content || '');
  const [author, setAuthor] = useState(blog?.author || 'Admin');
  const [published, setPublished] = useState(blog?.published ?? true);
  const [imageUrl, setImageUrl] = useState(blog?.imageUrl || '');
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      let finalImageUrl = imageUrl;

      // Handle image upload if a new file is selected
      if (imageFile) {
        setIsUploading(true);
        const storageRef = ref(storage, `blogs/${Date.now()}_${imageFile.name}`);
        
        // Add a 15-second timeout to prevent infinite hanging
        const uploadTask = uploadBytes(storageRef, imageFile);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Image upload timed out. This usually means Firebase Storage is not enabled or CORS is not configured properly in your Firebase Console. Please use the 'Image URL' option instead.")), 15000)
        );
        
        const snapshot = await Promise.race([uploadTask, timeoutPromise as Promise<Awaited<typeof uploadTask>>]);
        finalImageUrl = await getDownloadURL(snapshot.ref);
        setIsUploading(false);
      }

      const blogData = {
        title,
        slug: generateSlug(title),
        excerpt,
        content,
        author,
        imageUrl: finalImageUrl,
        published,
        updatedAt: serverTimestamp(),
      };

      if (blog?.id) {
        // Update existing blog
        await updateDoc(doc(db, 'blogs', blog.id), blogData);
      } else {
        // Create new blog
        await addDoc(collection(db, 'blogs'), {
          ...blogData,
          createdAt: serverTimestamp(),
        });
      }

      onSuccess();
    } catch (error: unknown) {
      console.error('Error saving blog:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred.';
      alert(`Failed to save blog: ${errorMsg}`);
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-800 transition">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          {blog ? 'Edit Blog' : 'Create New Blog'}
        </h2>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. 5 Tips for Healthy Heart"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (Short Summary)</label>
              <textarea
                required
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                placeholder="A brief summary for the blog list..."
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <select
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="Admin">Admin</option>
                  <option value="Dr. Sujith M S">Dr. Sujith M S</option>
                  <option value="Dr. Ashwini B S">Dr. Ashwini B S</option>
                </select>
              </div>
              <div className="flex items-end mb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">Published</span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center relative overflow-hidden bg-gray-50 h-[220px]">
              {imageFile ? (
                <img src={URL.createObjectURL(imageFile)} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
              ) : imageUrl ? (
                <img src={imageUrl} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
              ) : (
                <>
                  <ImageIcon size={48} className="text-gray-400 mb-3" />
                  <p className="text-sm text-gray-500 mb-2">Click to upload an image from your device</p>
                  <p className="text-xs text-gray-400">Optional. JPG, PNG or WebP</p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Or paste an Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImageFile(null); // Clear file if URL is provided
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            {isUploading && <p className="text-sm text-blue-600 animate-pulse">Uploading image...</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
            <ReactQuill 
              theme="snow" 
              value={content} 
              onChange={setContent} 
              modules={modules}
              className="h-64 mb-12"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={isSaving || isUploading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50"
          >
            {isSaving ? (
              'Saving...'
            ) : (
              <>
                <Save size={20} />
                {blog ? 'Update Blog' : 'Publish Blog'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
