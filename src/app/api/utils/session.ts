import { UserAttributes } from "@/types/users"
import { encodeToken } from "@/utils/auth"
import { jwtDecode } from "jwt-decode"
import { cookies } from "next/headers"
import { NextRequest } from "next/server"

export async function getSessionData(req: any) {
  const encryptedSessionData = cookies().get('session')?.value
  
  if(encryptedSessionData){
    const session = encryptedSessionData ? encodeToken(encryptedSessionData as any) : null
    return session
  } else {
    throw new Error('Session failed');
  }
}

export async function getUserAuth(request: NextRequest) {
  const authorizationHeader = request.headers.get('Authorization');

  if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
    const token = authorizationHeader.substring(7);

    try {
      const user: UserAttributes = jwtDecode(token);
      return user;
    } catch (error) {
      throw new Error('Invalid token');
    }
  } else {
    throw new Error('Token not found');
  }
}