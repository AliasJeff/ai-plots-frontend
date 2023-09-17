// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** add GET /api/add */
export async function addUsingGET(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.addUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/add', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** get GET /api/get */
export async function getUsingGET(options?: { [key: string]: any }) {
  return request<string>('/api/get', {
    method: 'GET',
    ...(options || {}),
  });
}
