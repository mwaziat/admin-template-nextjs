import { Roles } from "@/DB/models";
import { NextRequest, NextResponse } from "next/server";
import { literal, Op } from "sequelize";

export async function DELETE(req: NextRequest) {
  try {
    const data: {ids: number[]} = await req.json();

    const [updatedRowCount] = await Roles.update(
      { deletedAt: new Date() }, 
      {
        where: {
          id: {
            [Op.in]: data.ids,
          },
          deletedAt: {
            [Op.is]: literal('NULL'), 
          },
        },
      }
    );

    if (updatedRowCount === 0) {
      return NextResponse.json({ status: 0, message: "No records were updated. Data may not exist or already deleted." });
    }

    return NextResponse.json({ status: 1, message: "Success delete data", data: data });
  } catch (error) {
    if (error !== null && error instanceof Error) {
      return NextResponse.json({ status: 0, message: JSON.stringify(error.message) });
    }
    return NextResponse.json({ status: 0, message: 'Unhandled Error' });
  }
}