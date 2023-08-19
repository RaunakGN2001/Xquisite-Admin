import { useParams, useRouter } from "next/navigation";
import BillboardClient from "./components/client";
import { format } from 'date-fns';
import prisma from "@/lib/prismadb";

const BillboardsPage = async ({ params }) => {

    const billboards = await prisma.billBoard.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedBillboards = billboards.map(item => ({
        id: item.id,
        label: item.label,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))


    return ( 
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <BillboardClient data={formattedBillboards} />
            </div>
        </div>
     );
}
 
export default BillboardsPage;
