"use server"

import { GET, POST, PATCH } from "@/utils/services/fetch";

export const ViewDataUsers = async (): Promise<{ status: boolean, error: any, data: any[] | undefined }> => {
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