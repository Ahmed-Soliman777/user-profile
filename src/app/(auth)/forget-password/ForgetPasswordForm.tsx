"use client"
import React, { useState } from 'react'
import axios from 'axios'
import { toast } from "react-toastify"
import { useRouter } from 'next/navigation'
import { RegisterFormType } from '@/app/utils/types'
import Loading from '@/app/loading'

const ForgetPasswordForm = () => {

    const router = useRouter()

    const [error, setError] = useState<RegisterFormType>({})
    const [loading, setLoading] = useState<boolean>(false)

    const [formData, setFormData] = useState<RegisterFormType>({ Email: "", Password: "", ConfirmPassword: "" })

    function validation() {
        const newErrors: RegisterFormType = {}
        if (formData.Email === '') newErrors.Email = "Email is required"
        if (formData.Password === '') newErrors.Password = "Password is required"
        if (formData.ConfirmPassword === '') newErrors.ConfirmPassword = "Confirm password is required"

        if (formData.ConfirmPassword !== formData.Password) newErrors.ConfirmPassword = "Password is not matching"

        setError(newErrors)

        return Object.keys(newErrors).length === 0
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        try {
            if (validation()) {
                setLoading(true)
                const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}api/users`, {
                    Email: formData.Email,
                    Password: formData.Password,
                })
                setLoading(false)
                toast.success(`${data.message}`)
                router.replace("/login")
            }
        } catch (error) {
            setLoading(false)
            console.error(error);
            toast.error("An error ocurred, please try again")
        }
    }

    if (loading) {
        return <Loading />
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
            <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Reset Password</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

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

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-indigo-600 py-3 text-white font-bold hover:bg-indigo-700 shadow-md hover:shadow-lg active:scale-[0.99] transition-all"
                    >
                        Reset Password
                    </button>

                </form>
            </div>
        </div>
    )
}

export default ForgetPasswordForm
