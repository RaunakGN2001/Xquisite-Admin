'use client';

import useOrigin from "@/hooks/use-origin";
import { useParams } from "next/navigation";
import APIAlert from "@/components/ui/api-alert";

const ApiList = ({ entityName, entityIdName }) => {

    const params = useParams();
    const origin = useOrigin();

    const baseUrl = `${origin}/api/${params.storeId}`;

    return ( 
        <>
            <APIAlert title={'GET'} variant="public" description={`${baseUrl}/${entityName}`}/>
            <APIAlert title={'GET'} variant="public" description={`${baseUrl}/${entityName}/{${entityIdName}}`} />
            <APIAlert title={'POST'} variant="admin" description={`${baseUrl}/${entityName}`} />
            <APIAlert title={'PATCH'} variant="admin" description={`${baseUrl}/${entityName}/{${entityIdName}}`} />
            <APIAlert title={'DELETE'} variant="admin"   description={`${baseUrl}/${entityName}/{${entityIdName}}`} />
        </>
     );
}
 
export default ApiList;