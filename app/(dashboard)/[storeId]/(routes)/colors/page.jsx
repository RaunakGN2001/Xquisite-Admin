import { useParams, useRouter } from "next/navigation";
import { format } from 'date-fns';
import prisma from "@/lib/prismadb";
import ColorClient from "./components/client";

const ColorsPage = async ({ params }) => {

    const colors = await prisma.color.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedColors = colors.map(item => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))


    return ( 
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <ColorClient data={formattedColors} />
            </div>
        </div>
     );
}
 
export default ColorsPage;
