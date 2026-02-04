import { cookies } from "next/headers"
import { verifyTokenForPage } from "../utils/verifyToken"
import UpdateUser from "../profile/UpdateUser"

const page = async () => {
  const cookie = await cookies()
  const token = await cookie.get("token")?.value
  const userpayload = token ? verifyTokenForPage(token) : null

  if (!userpayload) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unauthorized</h2>
          <p className="text-gray-600">Please log in to update your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <UpdateUser id={userpayload.id} />
    </div>
  )
}

export default page
