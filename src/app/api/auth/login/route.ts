
import { Roles, Users } from "@/DB/models";
import { LoginAttributes } from "@/types/login";
import { generateToken, matchPassword } from "@/utils/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data: LoginAttributes = await req.json();
    if(data.username === '' && data.password === ''){
      return NextResponse.json({status: 0, message: "Username or password not empty", token: null}, {status: 401}) 
    }

    const row = await Users.findOne({
      where: {username: data.username},
      include: [
        {
          model: Roles,
          as: 'roles', // Alias yang digunakan dalam asssociation
          through: {
            attributes: [] // Opsional: jika Anda tidak ingin menampilkan atribut dari tabel pivot
          }
        }
      ]
    })
    
    if(row){
      
      const isMatch = await matchPassword(data.password, row.password);
      if(isMatch){
        // const exp = 60 * 60 * 24 * 7;
        const exp = 60 * 60;
        const token = await generateToken({
          id: row.id,
          firstName: row.firstName,
          lastName: row.lastName,
          name: row.name,
          email: row.email,
          roles: row.roles,
        }, exp )

        cookies().set('session', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          // maxAge: 60 * 60 * 24 * 7, // One week
          maxAge: exp, // One week
          path: '/',
        })

        return NextResponse.json({status: 1, message: "Data found", token: token}) 
      } else {
        return NextResponse.json({status: 0, message: "Password not match", token: null}, {status: 401}) 
      }
    } else {
      return NextResponse.json({status: 0, message: "No Data found", token: null}, {status: 401}) 
    }
    
  } catch (error) {
    if (error !== null && error instanceof Error) {
      return NextResponse.json({status: 0, message: JSON.stringify(error.message)})
    }
    return NextResponse.json({status: 0, message: 'Unhandled Error'})
  }
}
