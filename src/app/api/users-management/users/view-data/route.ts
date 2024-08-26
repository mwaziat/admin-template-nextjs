import { Roles, Users } from "@/DB/models";
import { UserAttributes, UserCreateAttributes, UserUpdateAttributes } from "@/types/users";
import { NextRequest, NextResponse } from "next/server";
import { getSessionData, getUserAuth } from '@/app/api/utils/session';
import { FilterObject, ViewData } from "@/app/api/utils/sequelize-filter-generator";
import { IncludeOptions, literal, Op } from "sequelize";
import { Logs } from "@/utils/logs";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {

  try {
    const session: UserAttributes = await getUserAuth(req)
    const filter: FilterObject = await req.json();
    const includes: IncludeOptions[] = [
      {
        model: Roles,
        /* where: {
          deletedAt: {
            [Op.is]: literal('NULL'),
          },
        }, */
        as: 'roles',
        through: {
          as: 'usersRoles',
          attributes: []
        }
      }
    ]
    const result = await ViewData(Users, filter, includes)

    if(result){
      return NextResponse.json({status: 1, message: "Data found", data: result.data, pagination: result.pagination}) 
    } else {
      return NextResponse.json({status: 0, message: "No Data found", result}) 
    }
    
  } catch (error) {
    console.log("err", error)
    Logs('view_data_users', JSON.stringify(error))
    if (error !== null && error instanceof Error) {
      return NextResponse.json({status: 0, message: JSON.stringify(error.message)})
    }
    return NextResponse.json({status: 0, message: 'Unhandled Error'})
  }
}
