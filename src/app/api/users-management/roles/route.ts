import { Roles } from "@/DB/models";
import { NextRequest, NextResponse } from "next/server";
import { getSessionData, getUserAuth } from '@/app/api/utils/session';
import sequelize from "@/DB/models/connection";
import { hashPassword } from "@/utils/auth";
import { RoleCreateAttributes, RoleUpdateAttributes } from "@/types/roles";
import { UserAttributes } from "@/types/users";
import { literal, Op } from "sequelize";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await Roles.findAll({
      where: {
        deletedAt: {
          [Op.is]: literal('null'),
        },
      }
    })
    if(rows.length > 0){
      return NextResponse.json({status: 1, message: "Data found", data: rows}) 
    } else {
      return NextResponse.json({status: 0, message: "No Data found", data: rows}) 
    }
  } catch (error) {
    if (error !== null && error instanceof Error) {
      return NextResponse.json({status: 0, message: JSON.stringify(error.message)})
    }
    return NextResponse.json({status: 0, message: 'Unhandled Error'})
  }
}

export async function POST(req: NextRequest) {
  const transaction = await sequelize.transaction();
  try {
    const session: UserAttributes = await getUserAuth(req)
    const data: RoleCreateAttributes = await req.json();
    
    const row = await Roles.create(
      {...data, createdBy: session.id, updatedBy: session.id},
      {transaction}
    )
    if(row){
      await transaction.commit();
      return NextResponse.json({status: 1, message: "Success create data", data: row}) 
    } else {
      return NextResponse.json({status: 0, message: "Failed create data", data: row}) 
    }
    
  } catch (error) {
    if (error !== null && error instanceof Error) {
      return NextResponse.json({status: 0, message: JSON.stringify(error.message)})
    }
    return NextResponse.json({status: 0, message: 'Unhandled Error'})
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data: RoleUpdateAttributes & { id: number } = await req.json();
    const { id, ...updateData } = data;

    const row = await Roles.findByPk(id);

    if (!row) {
      return NextResponse.json({ status: 0, message: "Data role not found" });
    }

    await row.update(updateData);

    return NextResponse.json({status: 1, message: "Success updated data", data: row}) 
  } catch (error) {
    if (error !== null && error instanceof Error) {
      return NextResponse.json({status: 0, message: JSON.stringify(error.message)})
    }
    return NextResponse.json({status: 0, message: 'Unhandled Error'})
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const data: RoleUpdateAttributes & { id: number } = await req.json();
    const { id, ...updateData } = data;

    const row = await Roles.findOne({
      where: {
        id,
        deletedAt: {
          [Op.is]: literal('null'),
        },
      },
    });

    if (!row) {
      return NextResponse.json({ status: 0, message: "Data role not found or already deleted" });
    }

    await row.update({ deletedAt: new Date() });
    return NextResponse.json({ status: 1, message: "Success delete data", data: row });
  } catch (error) {
    if (error !== null && error instanceof Error) {
      return NextResponse.json({ status: 0, message: JSON.stringify(error.message) });
    }
    return NextResponse.json({ status: 0, message: 'Unhandled Error' });
  }
}