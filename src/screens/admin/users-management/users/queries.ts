"use server"

import { RoleAttributes } from "@/types/roles";
import { UserAttributes } from "@/types/users";
import { GET, POST, PATCH, DELETE } from "@/utils/services/fetch";

export const ViewDataUsers = async (): Promise<{ status: boolean, error: any, data: UserAttributes[] | undefined }> => {
	return await GET(`${process.env.NEXT_PUBLIC_API_SERVER!}/users-management/users`)
		.then((res) => {
			return { status: true, error: null, data: res.data };
		})
		.catch((err) => {
			console.log("err", err);
			if (err !== null && err instanceof Error) {
        return { status: false, error: JSON.stringify(err.message), data: undefined };
      }
      return { status: false, error: err, data: undefined };
		});
}

export const ViewDataRoles = async (): Promise<{ status: boolean, error: any, data: RoleAttributes[] | undefined }> => {
	return await GET(`${process.env.NEXT_PUBLIC_API_SERVER!}/users-management/roles`)
		.then((res) => {
			return { status: true, error: null, data: res.data };
		})
		.catch((err) => {
			console.log("err", err);
			if (err !== null && err instanceof Error) {
        return { status: false, error: JSON.stringify(err.message), data: undefined };
      }
      return { status: false, error: err, data: undefined };
		});
}

export const CreateData = async (data: any): Promise<{ status: boolean, error: any, data: any }> => {
	return await POST(`${process.env.NEXT_PUBLIC_API_SERVER!}/users-management/users`, data)
		.then((res) => {
			console.log("res", res);
			if(res.status !== 0){
				return { status: true, error: null, data: res };
			} else {
				return { status: false, error: res.message, data: undefined };
			}
		})
		.catch((err) => {
			console.log("err", err);
			return { status: false, error: err, data: undefined };
		});
}

export const UpdateData = async (data: any): Promise<{ status: boolean, error: any, data: any }> => {
	return await PATCH(`${process.env.NEXT_PUBLIC_API_SERVER!}/users-management/users/${data.id!}`, data)
		.then((res) => {
			console.log("res", res);
			return { status: true, error: null, data: res };
		})
		.catch((err) => {
			console.log("err", err);
			return { status: false, error: err, data: undefined };
		});
}

export const DeleteData = async (data: any): Promise<{ status: boolean, error: any, data: any }> => {
	return await DELETE(`${process.env.NEXT_PUBLIC_API_SERVER!}/users-management/users`, data)
		.then((res) => {
			if(res.status !== 0){
				return { status: true, error: null, data: res };
			} else {
				return { status: false, error: res.message, data: undefined };
			}
		})
		.catch((err) => {
			console.log("err", err);
			return { status: false, error: err, data: undefined };
		});
}
export const DeleteManyData = async (data: any): Promise<{ status: boolean, error: any, data: any }> => {
	return await DELETE(`${process.env.NEXT_PUBLIC_API_SERVER!}/users-management/users/delete-many`, data)
	.then((res) => {
			if(res.status !== 0){
				return { status: true, error: null, data: res };
			} else {
				return { status: false, error: res.message, data: undefined };
			}
		})
		.catch((err) => {
			console.log("err", err);
			return { status: false, error: err, data: undefined };
		});
}