import { Roles, Users } from "@/DB/models";
import { UserAttributes, UserCreateAttributes, UserUpdateAttributes } from "@/types/users";
import { NextRequest, NextResponse } from "next/server";
import { getSessionData, getUserAuth } from '@/app/api/utils/session';
import sequelize from "@/DB/models/connection";
import UsersRoles from "@/DB/models/usersroles";
import { hashPassword } from "@/utils/auth";
import { literal, Op } from "sequelize";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await Users.findAll({
      attributes: { exclude: ['password'] },
      where: {
        deletedAt: {
          [Op.is]: literal('null'),
        },
      },
      include: [
        {
          model: Roles,
          as: 'roles',
          where: {
            deletedAt: {
              [Op.is]: literal('NULL'),
            },
          },
          through: {
            attributes: []
          }
        }
      ]
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
    const data: UserCreateAttributes = await req.json();
    const hashPass = await hashPassword(data.password)
    const row = await Users.create(
      {...data, password: hashPass, isActive: true, createdBy: session.id, updatedBy: session.id},
      {transaction}
    )
    if(row){
      if (data.roles && Array.isArray(data.roles)) {
        const userRoles = data.roles.map((roleId) => ({
          userId: row.id,
          roleId: roleId,
          createdAt: new Date(),
          updatedAt: new Date()
        }));
        
        await UsersRoles.bulkCreate(userRoles, { transaction });
      }
      await transaction.commit();
      return NextResponse.json({status: 1, message: "Data found", data: row}) 
    } else {
      return NextResponse.json({status: 0, message: "No Data found", data: row}) 
    }
    
  } catch (error) {
    if (error !== null && error instanceof Error) {
      return NextResponse.json({status: 0, message: JSON.stringify(error.message)})
    }
    return NextResponse.json({status: 0, message: 'Unhandled Error'})
  }
}

export async function PUT(req: NextRequest) {
  const transaction = await sequelize.transaction();

  try {
    const session: UserAttributes = await getUserAuth(req); 
    const data: UserUpdateAttributes & { id: number, roles?: number[] } = await req.json();
    const { id, roles, password, ...updateData } = data;

    const row = await Users.findByPk(id);

    if (!row) {
      return NextResponse.json({ status: 0, message: "Data not found" });
    }

    if (password) {
      const hashedPassword = await hashPassword(password);
      (updateData as any).password = hashedPassword;
    }

    await row.update(
      { ...updateData, updatedBy: session.id, updatedAt: new Date() },
      { transaction }
    );

    await UsersRoles.destroy({
      where: { userId: id },
      transaction,
    });

    // Tambahkan role baru jika ada
    if (roles && Array.isArray(roles)) {
      const userRoles = roles.map((roleId) => ({
        userId: row.id,
        roleId: roleId,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: session.id,
        updatedBy: session.id
      }));

      await UsersRoles.bulkCreate(userRoles, { transaction });
    }

    await transaction.commit();
    return NextResponse.json({ status: 1, message: "Data updated successfully", data: row });
  } catch (error) {
    await transaction.rollback();
    if (error !== null && error instanceof Error) {
      return NextResponse.json({ status: 0, message: JSON.stringify(error.message) });
    }
    return NextResponse.json({ status: 0, message: 'Unhandled Error' });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const data: UserUpdateAttributes & { id: number } = await req.json();
    const { id, ...updateData } = data;

    const row = await Users.findOne({
      where: {
        id,
        deletedAt: {
          [Op.is]: literal('null'),
        },
      },
    });

    if (!row) {
      return NextResponse.json({ status: 0, message: "Data user not found or already deleted" });
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