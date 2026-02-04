"use client"
import Loading from '@/app/loading'
import { RegisterFormType } from '@/app/utils/types'
import axios from 'axios'
import Link from 'next/link'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

const RegisterForm = () => {

    const route = useRouter()

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<RegisterFormType>({})

    const [formData, setFormData] = useState<RegisterFormType>({ FirstName: "", LastName: "", Email: "", Password: "", ConfirmPassword: "", Image: "" })

    function validation() {

        const newErrors: RegisterFormType = {}

        if (!formData.FirstName) { newErrors.FirstName = "First name is required" }
        if (!formData.LastName) { newErrors.LastName = "Last name is required" }
        if (!formData.Email) { newErrors.Email = "Email is required" }
        if (!formData.Password) { newErrors.Password = "Password is required" }

        if (formData.Password !== formData.ConfirmPassword) {
            newErrors.ConfirmPassword = "Password doesn't match"
        }

        setError(newErrors)

        // if no errors return true
        return Object.keys(newErrors).length === 0
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (validation()) {
            // console.log(formData);
            try {
                setLoading(true)
                const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}api/users/register`, {
                    FirstName: formData.FirstName,
                    LastName: formData.LastName,
                    Email: formData.Email,
                    Password: formData.Password,
                    Image: formData.Image,
                })
                toast.success(`${data.message}`)
                setLoading(false)
                route.replace("/")
            } catch (error) {
                console.error(error);
                toast.error("An error occured, please try again!")
                setLoading(false)
            }
        }


    }

    if (loading) {
        return <Loading />
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
            <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-600">First Name</label>
                            <input
                                type="text"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                placeholder="Ahmed"
                                name='FirstName'
                                value={formData.FirstName}
                                onChange={handleChange}
                            />
                            {error.FirstName && (
                                <p className="mt-1 text-sm font-medium text-red-500 animate-pulse">
                                    {error.FirstName}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-600">Last Name</label>
                            <input
                                type="text"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                placeholder="Mohamed"
                                name='LastName'
                                value={formData.LastName}
                                onChange={handleChange}
                            />
                            {error.LastName && (
                                <p className="mt-1 text-sm font-medium text-red-500 animate-pulse">
                                    {error.LastName}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-600">Email Address</label>
                        <input
                            type="email"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                            placeholder="user@mail.com"
                            name='Email'
                            value={formData.Email}
                            onChange={handleChange}
                        />
                        {error.Email && (
                            <p className="mt-1 text-sm font-medium text-red-500 animate-pulse">
                                {error.Email}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-600">Password</label>
                        <input
                            type="password"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                            placeholder="••••••••"
                            name='Password'
                            value={formData.Password}
                            onChange={handleChange}
                        />
                        {error.Password && (
                            <p className="mt-1 text-sm font-medium text-red-500 animate-pulse">
                                {error.Password}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-600">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                            placeholder="••••••••"
                            name='ConfirmPassword'
                            value={formData.ConfirmPassword}
                            onChange={handleChange}
                        />
                        {error.ConfirmPassword && (
                            <p className="mt-1 text-sm font-medium text-red-500 animate-pulse">
                                {error.ConfirmPassword}
                            </p>
                        )}
                    </div>

                    {/* TODO: create image input file and upload image to cloudinary to make it avaliable global */}

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-indigo-600 py-3 text-white font-bold hover:bg-indigo-700 shadow-md hover:shadow-lg active:scale-[0.99] transition-all"
                    >
                        Sign Up
                    </button>

                    <p className="text-center text-sm text-gray-600">
                        Already have an account? <Link href="/login" className="text-indigo-600 font-medium hover:underline">Log in</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default RegisterForm
