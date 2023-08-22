'use client';

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { columns } from "./columns";
import ApiList from "@/components/ui/api-list";



const ProductClient = ( { data } ) => {

    const router = useRouter();
    const params = useParams();

    // console.log(data);


    return ( 
        <>
            <div className='flex justify-between items-center'>
                <Heading title={`Products (${data.length})`} description='Manage products for your store' />
                <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
                    <Plus className='mr-2 h-4 w-4' />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey={'label'}/>
            <Heading title={'API'} description={'API Calls for Products'} /> 
            <Separator />
            <ApiList entityName={'products'} entityIdName={'productId'} />
        </>
     );
}
 
export default ProductClient;

