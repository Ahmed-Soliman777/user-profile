"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PostCard from './PostCard';
import UpdatePost from './UpdatePost';
import Loading from '../loading';

interface Post {
  id: number;
  TextContent: string;
  Files: string[];
  CreateAt: string;
  userId: number;
}

interface User {
  id: number;
  FirstName: string;
  LastName: string;
  Image?: string;
}

interface PostsProps {
  userId: number;
  userInfo: User;
}

const Posts = ({ userId, userInfo }: PostsProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);


  async function fetchPosts() {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}api/posts`
      );
      setPosts(data.posts || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load posts");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, [userId]);



  function handlePostDeleted() {
    fetchPosts();
  }

  function handleEditClick(post: Post) {
    setEditingPost(post);
  }

  function handlePostUpdated() {
    setEditingPost(null);
    fetchPosts();
  }

  if (loading) {
    return <Loading />;
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <p className="text-gray-500">No posts yet. Create your first post!</p>
      </div>
    );
  }

  return (
    <>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          user={userInfo}
          isOwner={post.userId === userId}
          onPostDeleted={handlePostDeleted}
          onEditClick={handleEditClick}
        />
      ))}

      {editingPost && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            <UpdatePost
              post={editingPost}
              onClose={() => setEditingPost(null)}
              onPostUpdated={handlePostUpdated}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Posts;