import { useParams, useRouter } from "next/navigation";
import { format } from 'date-fns';
import prisma from "@/lib/prismadb";
import SizeClient from "./components/client";

const SizesPage = async ({ params }) => {

    const sizes = await prisma.size.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedSizes = sizes.map(item => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))


    return ( 
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <SizeClient data={formattedSizes} />
            </div>
        </div>
     );
}
 
export default SizesPage;
