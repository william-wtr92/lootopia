import type { SimpleHeaders } from "@lootopia/common"
import { HTTPException } from "hono/http-exception"
import type { ContentfulStatusCode } from "hono/utils/http-status"

export const InternalError = (
  error: object,
  statusCode: number,
  headers?: SimpleHeaders
): HTTPException => {
  const responseHeaders = new Headers(headers)

  responseHeaders.set("Content-Type", "application/json")

  const responseBody = JSON.stringify(error)

  const errorResponse = new Response(responseBody, {
    status: statusCode,
    headers: responseHeaders,
  })

  return new HTTPException(statusCode as ContentfulStatusCode, {
    res: errorResponse,
  })
}
