"use client";
import Image from 'next/image';
import { MoreHorizontal, Globe, Trash2, Edit2 } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

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

interface PostCardProps {
    post: Post;
    user: User;
    isOwner: boolean;
    onPostDeleted?: () => void;
    onEditClick?: (post: Post) => void;
}

const PostCard = ({ post, user, isOwner, onPostDeleted, onEditClick }: PostCardProps) => {
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);

    function getTimeAgo(dateString: string) {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        return `${Math.floor(seconds / 86400)} days ago`;
    }

    async function handleDelete() {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            setDeleting(true);
            const { data } = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}api/posts/${post.id}`
            );
            toast.success(data.message || "Post deleted successfully");

            if (onPostDeleted) {
                onPostDeleted();
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete post");
            setDeleting(false);
        }
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-3">
                    <div className="h-11 w-11 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 p-0.5">
                        <div className="h-full w-full rounded-full bg-white p-0.5 overflow-hidden">
                            {user.Image ? (
                                <Image
                                    src={user.Image}
                                    alt={`${user.FirstName}'s profile`}
                                    className="w-full h-full object-cover rounded-full"
                                    width={44}
                                    height={44}
                                />
                            ) : (
                                <div className="w-full h-full rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold text-sm">
                                    {user.FirstName?.charAt(0)}{user.LastName?.charAt(0)}
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900">
                            {user.FirstName} {user.LastName}
                        </h4>
                        <div className="flex items-center gap-1 text-gray-500">
                            <span className="text-xs">{getTimeAgo(post.CreateAt)}</span>
                            <span>•</span>
                            <Globe size={12} />
                        </div>
                    </div>
                </div>

                {isOwner && (
                    <div className="relative">
                        <button
                            onClick={() => setShowOptions(!showOptions)}
                            className="p-2 hover:bg-gray-50 rounded-full text-gray-400 transition-colors"
                        >
                            <MoreHorizontal size={20} />
                        </button>

                        {showOptions && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-gray-100 shadow-lg z-10">
                                <button
                                    onClick={() => {
                                        setShowOptions(false);
                                        if (onEditClick) onEditClick(post);
                                    }}
                                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 rounded-t-xl"
                                >
                                    <Edit2 size={16} className="text-indigo-500" />
                                    Edit Post
                                </button>
                                <button
                                    onClick={() => {
                                        setShowOptions(false);
                                        handleDelete();
                                    }}
                                    disabled={deleting}
                                    className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 rounded-b-xl disabled:opacity-50"
                                >
                                    <Trash2 size={16} />
                                    {deleting ? "Deleting..." : "Delete Post"}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="space-y-3">
                {post.TextContent && (
                    <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                        {post.TextContent}
                    </p>
                )}

                {post.Files && post.Files.length > 0 && (
                    <div className={`rounded-2xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50 ${post.Files.length === 1 ? '' :
                        post.Files.length === 2 ? 'grid grid-cols-2 gap-1' :
                            post.Files.length === 3 ? 'grid grid-cols-2 gap-1' :
                                'grid grid-cols-2 gap-1'
                        }`}>
                        {post.Files.slice(0, 4).map((file, index) => (
                            <div
                                key={index}
                                className={`relative ${post.Files.length === 1 ? 'col-span-2' :
                                    post.Files.length === 3 && index === 0 ? 'col-span-2' :
                                        ''
                                    }`}
                            >
                                <Image
                                    src={file}
                                    alt={`post image ${index + 1}`}
                                    className={`w-full object-cover ${post.Files.length === 1 ? 'h-96' : 'h-48'
                                        }`}
                                    width={600}
                                    height={post.Files.length === 1 ? 384 : 192}
                                />
                                {index === 3 && post.Files.length > 4 && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <span className="text-white text-3xl font-bold">
                                            +{post.Files.length - 4}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostCard;
