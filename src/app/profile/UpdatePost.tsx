"use client";
import { X, Save, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UpdatePostDTO } from '../utils/dtos';

interface Post {
  id: number;
  TextContent: string;
  Files: string[];
  CreateAt: string;
  userId: number;
}

interface UpdatePostProps {
  post: Post;
  onClose: () => void;
  onPostUpdated: () => void;
}

const UpdatePost = ({ post, onClose, onPostUpdated }: UpdatePostProps) => {
  const [textContent, setTextContent] = useState<string>(post.TextContent || "");
  const [existingImages, setExistingImages] = useState<string[]>(post.Files || []);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
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

      const totalImages = existingImages.length + newImageFiles.length + filesArray.length;
      if (totalImages > 5) {
        toast.error("Maximum 5 images allowed per post");
        return;
      }

      setNewImageFiles(prev => [...prev, ...filesArray]);

      filesArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  function handleRemoveExistingImage(index: number) {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  }

  function handleRemoveNewImage(index: number) {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!textContent.trim() && existingImages.length === 0 && newImageFiles.length === 0) {
      toast.error("Post cannot be empty");
      return;
    }

    try {
      setUploading(true);

      let newImageURLs: string[] = [];

      if (newImageFiles.length > 0) {
        const uploadPromises = newImageFiles.map(file => uploadImageToCloudinary(file));
        newImageURLs = await Promise.all(uploadPromises);
      }

      const allImageURLs = [...existingImages, ...newImageURLs];

      const updateData: UpdatePostDTO = {
        TextContent: textContent,
        Files: allImageURLs
      };

      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}api/posts/${post.id}`,
        updateData
      );

      toast.success(data.message || "Post updated successfully!");
      setUploading(false);
      onPostUpdated();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update post");
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-4xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col">

        <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-extrabold text-xl text-gray-900">Edit Your Post</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 text-gray-400 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Text Content */}
          <textarea
            className="w-full bg-gray-50 rounded-2xl p-4 text-gray-800 border-none focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            rows={5}
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="What's on your mind?"
            disabled={uploading}
          />

          {existingImages.length > 0 && (
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block">Current Images</label>
              <div className="grid grid-cols-2 gap-3">
                {existingImages.map((image, index) => (
                  <div key={index} className="relative group rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                    <Image
                      src={image}
                      alt={`existing ${index + 1}`}
                      className="w-full h-32 object-cover"
                      width={200}
                      height={128}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images */}
          {newImagePreviews.length > 0 && (
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block">New Images</label>
              <div className="grid grid-cols-2 gap-3">
                {newImagePreviews.map((preview, index) => (
                  <div key={index} className="relative group rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                    <Image
                      src={preview}
                      alt={`new ${index + 1}`}
                      className="w-full h-32 object-cover"
                      width={200}
                      height={128}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add More Images Button */}
          {(existingImages.length + newImageFiles.length) < 5 && (
            <label className="w-full px-4 py-3 bg-gray-50 border-2 border-dashed border-gray-300 text-gray-600 rounded-2xl font-medium hover:bg-gray-100 hover:border-indigo-400 transition-all flex items-center justify-center gap-2 cursor-pointer">
              <ImageIcon size={20} />
              Add More Images ({5 - (existingImages.length + newImageFiles.length)} remaining)
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                disabled={uploading}
              />
            </label>
          )}
        </div>

        <div className="p-6 bg-gray-50/50 flex gap-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={uploading}
            className="flex-1 px-4 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-100 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={uploading}
            className="flex-1 px-4 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePost;