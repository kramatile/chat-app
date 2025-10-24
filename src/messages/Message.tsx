import { DefaultMessage } from "./DefaultMessage";

export function Message({type,id}:{type:string | undefined ,id:string | undefined}){
    return(
        <DefaultMessage/>
    )
}