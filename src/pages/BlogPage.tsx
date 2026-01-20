import { useEffect, useState } from 'react';
import { Calendar, User, ArrowLeft, X } from 'lucide-react';
import { supabase, type BlogPost } from '../lib/supabase';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const categories = [
    { id: 'all', label: 'All Posts' },
    { id: 'news', label: 'News' },
    { id: 'insights', label: 'Insights' },
    { id: 'projects', label: 'Projects' },
  ];

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory, posts]);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:team_members(*)
        `)
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
      setFilteredPosts(data || []);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-white">
        <div className="relative h-96 overflow-hidden">
          <img
            src={selectedPost.featured_image}
            alt={selectedPost.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
          <button
            onClick={() => setSelectedPost(null)}
            className="mb-6 inline-flex items-center space-x-2 text-white hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Blog</span>
          </button>

          <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium capitalize">
                {selectedPost.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              {selectedPost.title}
            </h1>

            <div className="flex items-center space-x-6 mb-8 pb-8 border-b text-slate-600">
              {selectedPost.author && (
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>{selectedPost.author.name}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(selectedPost.created_at)}</span>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-slate-600 mb-6 leading-relaxed">
                {selectedPost.excerpt}
              </p>
              <div className="text-slate-700 leading-relaxed whitespace-pre-line">
                {selectedPost.content}
              </div>
            </div>

            {selectedPost.author && (
              <div className="mt-12 pt-8 border-t">
                <h3 className="text-lg font-bold text-slate-900 mb-4">About the Author</h3>
                <div className="flex items-start space-x-4">
                  <img
                    src={selectedPost.author.photo}
                    alt={selectedPost.author.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-slate-900">{selectedPost.author.name}</p>
                    <p className="text-slate-600 text-sm mb-2">{selectedPost.author.role}</p>
                    <p className="text-slate-600">{selectedPost.author.bio}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="h-20"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Blog & Insights</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Thoughts, stories, and insights from our team
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-slate-300 border-t-slate-800 rounded-full mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white text-slate-900 rounded-full text-xs font-medium capitalize">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t">
                    {post.author && (
                      <div className="flex items-center space-x-2">
                        <img
                          src={post.author.photo}
                          alt={post.author.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span>{post.author.name}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-slate-600">No posts found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
