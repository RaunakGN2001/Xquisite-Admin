'use client';

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { columns } from "./columns";
import ApiList from "@/components/ui/api-list";



const SizeClient = ( { data } ) => {

    const router = useRouter();
    const params = useParams();

    // console.log(data);


    return ( 
        <>
            <div className='flex justify-between items-center'>
                <Heading title={`Sizes (${data.length})`} description='Manage sizes for your store' />
                <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
                    <Plus className='mr-2 h-4 w-4' />
                    Add New
                </Button>
            </div> 
            <Separator />
            <DataTable columns={columns} data={data} searchKey={'name'}/>
            <Heading title={'API'} description={'API Calls for Sizes'} /> 
            <Separator />
            <ApiList entityName={'sizes'} entityIdName={'sizeId'} />
        </>
     );
}
 
export default SizeClient;

