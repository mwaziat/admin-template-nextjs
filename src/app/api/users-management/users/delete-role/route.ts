import { Users, UsersRoles } from "@/DB/models";
import { NextRequest, NextResponse } from "next/server";
import { literal, Op } from "sequelize";

export async function DELETE(req: NextRequest) {
  try {
    const { id }: { id: number } = await req.json();

    const deletedRowCount = await UsersRoles.destroy({
      where: {
        id: id
      }
    });

    if (deletedRowCount === 0) {
      return NextResponse.json({ status: 0, message: "No records were updated. Data may not exist or already deleted." });
    }

    return NextResponse.json({ status: 1, message: "Success delete data", data: {id} });
  } catch (error) {
    if (error !== null && error instanceof Error) {
      return NextResponse.json({ status: 0, message: JSON.stringify(error.message) });
    }
    return NextResponse.json({ status: 0, message: 'Unhandled Error' });
  }
}