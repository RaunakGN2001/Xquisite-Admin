'use client';

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { columns } from "./columns";
import ApiList from "@/components/ui/api-list";



const OrderClient = ({ data }) => {

    // console.log(data);


    return (
        <> 
            <Heading title={`Orders (${data.length})`} description='Manage orders for your store' />
            <Separator />
            <DataTable columns={columns} data={data} searchKey={'products'} />
            <Heading title={'API'} description={'API Calls for Orders'} />
            <Separator />
            <ApiList entityName={'orders'} entityIdName={'orderId'} />
        </>
    );
}

export default OrderClient;

