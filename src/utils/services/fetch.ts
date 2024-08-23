import { cookies } from "next/headers";

const getHeaders = () => ({
  Cookie: cookies().toString(),
});

const getToken = (): string => {
  const cookiesStore = cookies()
  const auth = cookiesStore.get('Authorization')
  
  if(auth){
    return `Bearer ${auth.value}`
  } else {
    return ''
  }
}

export const POST = async (path: string, formData: any, options?: any) => {
  return await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getToken(),
      ...getHeaders(),
    },
    body: JSON.stringify(formData),
  }).then((res) => res.json())
}

export const GET = async (path: string, options?: any) => {
  return await fetch(path, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getToken(),
      ...getHeaders(),
    },
  }).then((res) => res.json())
}

export const PUT = async (path: string, formData: any, options?: any) => {
  return await fetch(path, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getToken(),
      ...getHeaders(),
    },
    body: JSON.stringify(formData),
  }).then((res) => res.json())
}

export const PATCH = async (path: string, formData: any, options?: any) => {
  return await fetch(path, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getToken(),
      ...getHeaders(),
    },
    body: JSON.stringify(formData),
  }).then((res) => res.json())
}

export const DELETE = async (path: string, formData: any, options?: any) => {
  return await fetch(path, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getToken(),
      ...getHeaders(),
    },
    body: JSON.stringify(formData),
  }).then((res) => res.json())
}