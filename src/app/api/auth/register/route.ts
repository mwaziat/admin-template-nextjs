
import { LoginAttributes } from "@/types/login";
import { generateToken, matchPassword } from "@/utils/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const data: LoginAttributes = await req.json();
    

    return NextResponse.json({status: 0, message: "No Data found", token: data}, {status: 401}) 
    
  } catch (error) {
    if (error !== null && error instanceof Error) {
      return NextResponse.json({status: 0, message: JSON.stringify(error.message)})
    }
    return NextResponse.json({status: 0, message: 'Unhandled Error'})
  }
}
