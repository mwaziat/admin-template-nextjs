import { Roles } from "@/DB/models";
import { UserAttributes } from "@/types/users";
import { NextRequest, NextResponse } from "next/server";
import { getUserAuth } from '@/app/api/utils/session';
import { FilterObject, ViewData } from "@/app/api/utils/sequelize-filter-generator";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {

  try {
    const session: UserAttributes = await getUserAuth(req)
    const filter: FilterObject = await req.json();
    const result = await ViewData(Roles, filter)

    if(result){
      return NextResponse.json({status: 1, message: "Data found", data: result.data, pagination: result.pagination}) 
    } else {
      return NextResponse.json({status: 0, message: "No Data found", result}) 
    }
    
  } catch (error) {
    if (error !== null && error instanceof Error) {
      return NextResponse.json({status: 0, message: JSON.stringify(error.message)})
    }
    return NextResponse.json({status: 0, message: 'Unhandled Error'})
  }
}
