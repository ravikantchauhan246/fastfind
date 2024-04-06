import { Hono } from "hono"
import { handle } from "hono/vercel"
import {env} from "hono/adapter"
import { Redis } from "@upstash/redis"

export const runtime="edge"

const app= new Hono().basePath('/api')

type EnvConfig={
    UPSTASH_REDIS_REST_TOKEN:string
    UPSTASH_REDIS_REST_URL:string
}

app.get('/search',(c)=>{
    const {UPSTASH_REDIS_REST_TOKEN,UPSTASH_REDIS_REST_URL}= env<EnvConfig>(c)
    const redis = new Redis({
        token:UPSTASH_REDIS_REST_TOKEN,
        url:UPSTASH_REDIS_REST_URL,
    })
    const query= c.req.query("q")
    if(!query){
        return c.json({message: "Invalid search query"},{status:400})
    }
    return c.json({})
})

export const GET= handle(app)
export default app as never