"use client";
import { Camera, Save, User, Mail, X } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../loading';
import { UpdateUserDTO } from '../utils/dtos';

interface UpdateUserProps {
    id: number;
    onClose?: () => void;
}

const UpdateUser = ({ id, onClose }: UpdateUserProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [uploading, setUploading] = useState<boolean>(false);

    const [formData, setFormData] = useState<UpdateUserDTO>({
        FirstName: "",
        LastName: "",
        Email: "",
        Image: ""
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");

    useEffect(() => {
        async function getUserProfile(id: number) {
            try {
                setLoading(true);
                const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}api/users/profile/${id}`);

                setFormData({
                    FirstName: data?.profile?.FirstName || "",
                    LastName: data?.profile?.LastName || "",
                    Email: data?.profile?.Email || "",
                    Image: data?.profile?.Image || ""
                });

                 console.log(data);

                setImagePreview(data?.profile?.Image || "");
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error(error);
                toast.error("Failed to load profile data");
            }
        }
        getUserProfile(id);
    }, [id]);

    async function uploadImageToCloudinary(file: File) {
        const formImageData = new FormData();
        formImageData.append("file", file);
        formImageData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string);

        const { data } = await axios.post(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            formImageData
        );
        return data.secure_url;
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    function handleRemoveImage() {
        setImageFile(null);
        setImagePreview(formData.Image || "");
    }

    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            setUploading(true);

            let imageURL = formData.Image || "";

            if (imageFile && imageFile instanceof File) {
                imageURL = await uploadImageToCloudinary(imageFile);
            }

            const { data } = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}api/users/profile/${id}`,
                {
                    FirstName: formData.FirstName,
                    LastName: formData.LastName,
                    Email: formData.Email,
                    Image: imageURL
                }
            );            

            toast.success(data.message || "Profile updated successfully!");
            setUploading(false);

            if (onClose) {
                setTimeout(() => onClose(), 1000);
            }
        } catch (error) {
            console.error(error);
            toast.error(`"Failed to update profile. Please try again."`);
            setUploading(false);
        }
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-4xl border border-gray-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="h-32 bg-linear-to-r from-indigo-100 to-purple-100 relative">
                <div className="absolute -bottom-12 left-8">
                    <div className="relative group">
                        <div className="h-24 w-24 rounded-3xl border-4 border-white shadow-md overflow-hidden bg-gray-200">
                            {imagePreview ? (
                                <Image
                                    src={imagePreview}
                                    alt="profile"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                    width={96}
                                    height={96}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-400 font-bold text-2xl">
                                    {formData.FirstName?.charAt(0)}{formData.LastName?.charAt(0)}
                                </div>
                            )}
                        </div>

                        <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-3xl">
                            <Camera className="text-white" size={24} />
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>
                </div>
            </div>

            <div className="px-8 pt-16 pb-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-black text-gray-900">Account Settings</h2>
                    <p className="text-gray-500 text-sm">Update your personal information and profile picture</p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <User size={16} className="text-indigo-500" /> First Name
                            </label>
                            <input
                                type="text"
                                name="FirstName"
                                value={formData.FirstName}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3.5 text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <User size={16} className="text-indigo-500" /> Last Name
                            </label>
                            <input
                                type="text"
                                name="LastName"
                                value={formData.LastName}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3.5 text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <Mail size={16} className="text-indigo-500" /> Email Address
                        </label>
                        <input
                            type="email"
                            name="Email"
                            value={formData.Email}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3.5 text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                    </div>

                    {imageFile && (
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">New Profile Picture</label>
                            <div className="relative rounded-2xl overflow-hidden border border-gray-100 group">
                                <div className="absolute top-3 right-3 z-10">
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full backdrop-blur-sm transition-all"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                <Image
                                    src={imagePreview}
                                    alt="preview"
                                    className="w-full h-32 object-cover"
                                    width={400}
                                    height={128}
                                />
                            </div>
                        </div>
                    )}

                    <div className="pt-6 flex flex-col sm:flex-row gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                        >
                            <X size={18} /> Discard Changes
                        </button>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="flex-1 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? (
                                <>
                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save size={18} /> Update Profile
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <div className="px-8 py-4 bg-indigo-50 border-t border-indigo-100">
                <p className="text-xs text-indigo-600 text-center font-medium">
                    Your information is secure. Profile updates might take a few seconds to reflect across all sections.
                </p>
            </div>
        </div>
    );
};

export default UpdateUser;
