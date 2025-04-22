import { useState, useEffect } from 'react';
import axios from 'axios';
import { Textarea } from '@/components/ui/textarea'; // Tailwind UI component
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const CommunityDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [anonymous, setAnonymous] = useState(false);

  const token = localStorage.getItem('token'); // or from context

  const fetchPosts = async () => {
    try {
      const res = await axios.get('/api/community/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to load posts:', err);
    }
  };

  const handleSubmit = async () => {
    if (!newPost.trim()) return;
    try {
      await axios.post(
        '/api/community/post',
        { content: newPost, anonymous },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewPost('');
      fetchPosts(); // Refresh after post
    } catch (err) {
      console.error('Post error:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-indigo-700 text-center">🌍 Community Dashboard</h1>

      {/* Post form */}
      <div className="bg-white p-4 rounded-xl shadow-md space-y-4">
        <Textarea
          rows={4}
          placeholder="Share your thoughts with the community..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <div className="flex justify-between items-center">
          <label className="text-sm text-gray-600 flex items-center gap-2">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
            />
            Post anonymously
          </label>
          <Button onClick={handleSubmit} className="bg-indigo-600 text-white hover:bg-indigo-700">
            Post
          </Button>
        </div>
      </div>

      {/* Posts list */}
      <div className="space-y-4">
        {posts.map((post, index) => (
          <Card key={index} className="bg-gray-50 shadow-sm">
            <CardContent className="p-4">
              <p className="text-gray-800">{post.content}</p>
              <div className="text-xs text-gray-500 mt-2 flex justify-between">
                <span>
                  {post.anonymous ? 'Anonymous' : post?.userId?.email || 'User'}
                </span>
                <span>{new Date(post.createdAt).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunityDashboard;
