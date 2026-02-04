import { cookies } from "next/headers"
import { verifyTokenForPage } from "../utils/verifyToken"
import Profile from "./Profile"

const page = async () => {

  const cookie = await cookies()

  const token = await cookie.get("token")?.value

  const userpayload = token ? verifyTokenForPage(token) : null

  return (
    <div>
      {userpayload &&
        <Profile id={userpayload?.id} />
      }
    </div>
  )
}

export default page
