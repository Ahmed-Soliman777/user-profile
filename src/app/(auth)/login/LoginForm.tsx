"use client"
import Loading from "@/app/loading"
import { LoginFormType } from "@/app/utils/types"
import axios from "axios"
import Link from "next/link"
import React, { useState } from "react"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

const LoginForm = () => {

    const router = useRouter()

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<LoginFormType>({})

    const [formData, setFormData] = useState<LoginFormType>({ Email: "", Password: "" })

    function validation() {

        const newErrors: LoginFormType = {}

        if (formData.Email === '') newErrors.Email = "Email is required"
        if (formData.Password === '') newErrors.Password = "Password is required"

        setError(newErrors)

        return Object.keys(newErrors).length === 0
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (validation()) {
            try {
                setLoading(true)
                const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}api/users/login`, { Email: formData.Email, Password: formData.Password })
                toast.success(`${data.message}`)
                setLoading(false)
                router.replace("/profile")
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
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <form
                onSubmit={handleFormSubmit}
                className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg"
            >
                <h2 className="text-center text-2xl font-bold text-gray-800">Login</h2>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={formData.Email}
                        onChange={handleChange}
                        name="Email"
                        placeholder="your@email.com"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                    {error.Email && (
                        <p className="mt-1 text-sm font-medium text-red-500 animate-pulse">
                            {error.Email}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        name="Password"
                        value={formData.Password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                    {error.Password && (
                        <p className="mt-1 text-sm font-medium text-red-500 animate-pulse">
                            {error.Password}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 active:scale-[0.98] transition-transform"
                >
                    Login
                </button>

                <p className="text-center text-sm text-gray-600">
                    New to MODBOOK? <Link href="/register" className="text-indigo-600 font-medium hover:underline">Create a new account</Link>
                </p>
                <p className="text-center text-sm text-gray-600">
                    Forgot Password? <Link href="/forget-password" className="text-indigo-600 font-medium hover:underline">Reset it here</Link>
                </p>
            </form>
        </div>
    )
}

export default LoginForm
