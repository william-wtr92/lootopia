import { client } from "@client/web/utils/client"

export const reactivateAccountRequest = async(body: {email: string, password: string}) => {
    const response = await client.auth["reactivate-account"].request.$post({
        json: body
    })
    
    if (response.ok) {
        const data = await response.json()

        return data.result
    }

    return [response.ok, (await response.json()).key]
}