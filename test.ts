// like this: http://localhost:4001/api/v0/blog/:blogId/comment/:commentId
import { ENDPOINT } from './shared';

const api = 'blog/:blogId/comment/:commentId';
const blogId = '123';
const commentId = '456';
const params = [blogId, commentId];

function extractParams(endPoint: string, params: string[]): string {
  console.log(params);
  console.log(endPoint.match(/:\w+/g));
  const apiParamsCount = endPoint.match(/:\w+/g)?.length || 0;
  if (apiParamsCount !== params.length) {
    return 'params count mismatch';
  }
  for (let i = 0; i < apiParamsCount; i++) {
    endPoint = endPoint.replace(/:\w+/, params[i]);
  }

  return 'http://localhost:4001/api/v0/' + endPoint;
}

const url = extractParams(api, params);
console.log(url);

console.log(typeof ENDPOINT.GET_BLOG_COMMENTS);
