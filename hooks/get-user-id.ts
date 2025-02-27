/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 26/02/2025 - 09:45:02
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 26/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import type { UserIdentity } from 'convex/server'
import { query } from './_generated/server'

export default query(async (ctx) => {
    const user = await ctx.auth.getUserIdentity()

    if (user === null) {
        return null
    }

    return user.tokenIdentifier
})