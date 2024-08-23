"use server"

import { GET, POST, PATCH } from "@/utils/services/fetch";

export const ViewData = async (path:string, data: any): Promise<{ status: boolean, error: any, data: any }> => {
	return await POST(`${path!}`, data)
		.then((res) => {
			if(res.status !== 0){
				return { status: true, error: null, data: {data: res.data, pagination: res.pagination} };
			} else {
				return { status: false, error: res.message, data: undefined };
			}
		})
		.catch((err) => {
			console.log("err", err);
			return { status: false, error: err, data: undefined };
		});
}
