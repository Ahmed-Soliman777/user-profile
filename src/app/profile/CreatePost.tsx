"use client";
import { Image as ImageIcon, X, Send } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CreatePostDTO } from '../utils/dtos';

interface CreatePostProps {
    userId: number;
    onPostCreated?: () => void;
}

const CreatePost = ({ userId, onPostCreated }: CreatePostProps) => {
    const [textContent, setTextContent] = useState<string>("");
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [uploading, setUploading] = useState<boolean>(false);

    async function uploadImageToCloudinary(file: File): Promise<string> {
        const formImageData = new FormData();
        formImageData.append("file", file);
        formImageData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string);

        const { data } = await axios.post(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            formImageData
        );
        return data.secure_url;
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (files && files.length > 0) {
            const filesArray = Array.from(files);

            if (imageFiles.length + filesArray.length > 5) {
                toast.error("You can only upload up to 5 images");
                return;
            }

            setImageFiles(prev => [...prev, ...filesArray]);

            filesArray.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreviews(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    }

    function handleRemoveImage(index: number) {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!textContent.trim() && imageFiles.length === 0) {
            toast.error("Post cannot be empty. Add text or images.");
            return;
        }

        try {
            setUploading(true);

            let imageURLs: string[] = [];

            if (imageFiles.length > 0) {
                const uploadPromises = imageFiles.map(file => uploadImageToCloudinary(file));
                imageURLs = await Promise.all(uploadPromises);
            }

            const postData: CreatePostDTO = {
                TextContent: textContent,
                Files: imageURLs
            };

            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}api/posts`,
                postData
            );

            toast.success(data.message || "Post created successfully!");

            setTextContent("");
            setImageFiles([]);
            setImagePreviews([]);
            setUploading(false);

            if (onPostCreated) {
                onPostCreated();
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to create post. Please try again.");
            setUploading(false);
        }
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
            <form onSubmit={handleSubmit}>
                <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        U
                    </div>
                    <textarea
                        className="w-full bg-transparent text-gray-700 placeholder:text-gray-400 text-lg border-none focus:ring-0 outline-none resize-none pt-2"
                        placeholder="What's on your mind?"
                        rows={2}
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        disabled={uploading}
                    />
                </div>

                {imagePreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative rounded-2xl overflow-hidden border border-gray-100 group">
                                <div className="absolute top-2 right-2 z-10">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full backdrop-blur-sm transition-all"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                <Image
                                    src={preview}
                                    alt={`preview ${index + 1}`}
                                    className="w-full h-32 object-cover"
                                    width={200}
                                    height={128}
                                />
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-50">
                    <div className="flex gap-2">
                        <label className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-full transition-colors cursor-pointer" title="Add Photo">
                            <ImageIcon size={22} />
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                disabled={uploading}
                            />
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={uploading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-bold text-sm shadow-md shadow-indigo-200 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? (
                            <>
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Posting...
                            </>
                        ) : (
                            <>
                                Post <Send size={16} />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;