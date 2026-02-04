"use client"
import axios from "axios"
import Image from "next/image"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Loading from "../loading"
import Posts from "./Posts"
import UpdateUser from "./UpdateUser"
import CreatePost from "./CreatePost"
import { useRouter } from "next/navigation"

const Profile = ({ id }: { id: number }) => {

    const router = useRouter()

    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [profileImage, setProfileImage] = useState<string>("")

    const [loading, setLoading] = useState<boolean>(false)
    const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false)
    const [refreshKey, setRefreshKey] = useState<number>(0)

    useEffect(() => {
        async function getUserProfile(id: number) {
            try {
                setLoading(true)
                const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}api/users/profile/${id}`)
                setFirstName(data?.profile?.FirstName)
                setLastName(data?.profile?.LastName)
                setProfileImage(data?.profile?.Image)
                setLoading(false)
            } catch (error) {
                setLoading(false)
                console.error(error);
                toast.error("An error occured, please try again")
            }
        }
        getUserProfile(id)
    }, [id])

    if (loading) {
        return <Loading />
    }

    async function handleLogout() {
        try {
            setLoading(true);
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}api/users/logout`)
            toast.success(data.message || "Logged out successfully!")
            setLoading(false);
            router.replace("/")
        } catch (error) {
            setLoading(false);
            toast.error("Failed to log out. Please try again.")
            console.error(error);
        }
    }

    return (
        <>
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="h-20 bg-linear-to-r from-indigo-500 to-purple-600"></div>

                <div className="px-6 pb-6">
                    <div className="relative flex justify-between items-end -mt-10">
                        <div className="relative group">
                            <div className="h-24 w-24 rounded-2xl overflow-hidden border-4 border-white bg-gray-100 shadow-sm">
                                {profileImage ? (
                                    <Image
                                        src={profileImage}
                                        alt={`${firstName}'s profile`}
                                        height={100}
                                        width={100}
                                        className="object-cover h-full w-full transform group-hover:scale-110 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-indigo-50 text-indigo-400 font-bold text-2xl">
                                        {firstName?.charAt(0)}{lastName?.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <span className="absolute bottom-1 right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></span>
                        </div>

                        <button
                            onClick={() => setShowUpdateModal(true)}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200"
                        >
                            Edit Profile
                        </button>

                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200"
                        >
                            Logout  
                        </button>
                    </div>
                    <div className="mt-4">
                        <h2 className="text-xl font-bold text-gray-900 capitalize">
                            {firstName} {lastName}
                        </h2>
                    </div>
                </div>
            </div>

            <div className="max-w-md mx-auto mt-5">
                <CreatePost
                    userId={id}
                    onPostCreated={() => {
                        setRefreshKey(prev => prev + 1)
                    }}
                />
            </div>

            <div className="max-w-md mx-auto">
                <Posts
                    key={refreshKey}
                    userId={id}
                    userInfo={{
                        id: id,
                        FirstName: firstName,
                        LastName: lastName,
                        Image: profileImage
                    }}
                />
            </div>

            {showUpdateModal && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="max-w-2xl w-full">
                        <UpdateUser
                            id={id}
                            onClose={() => {
                                setShowUpdateModal(false)
                                async function refreshProfile() {
                                    try {
                                        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}api/users/profile/${id}`);
                                        setFirstName(data?.profile?.FirstName);
                                        setLastName(data?.profile?.LastName);
                                        setProfileImage(data?.profile?.Image);
                                    } catch (error) {
                                        console.error(error);
                                    }
                                }
                                refreshProfile()
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default Profile
