'use client';

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { columns } from "./columns";
import ApiList from "@/components/ui/api-list";



const BillboardClient = ( { data } ) => {

    const router = useRouter();
    const params = useParams();

    // console.log(data);


    return ( 
        <>
            <div className='flex justify-between items-center'>
                <Heading title={`Billboards (${data.length})`} description='Manage billboards for your store' />
                <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
                    <Plus className='mr-2 h-4 w-4' />
                    Add New
                </Button>
            </div> 
            <Separator />
            <DataTable columns={columns} data={data} searchKey={'label'}/>
            <Heading title={'API'} description={'API Calls for Billboards'} /> 
            <Separator />
            <ApiList entityName={'billboards'} entityIdName={'billboardId'} />
        </>
     );
}
 
export default BillboardClient;

