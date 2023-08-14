import prisma from "@/lib/prismadb";
import { redirect } from "next/navigation";

const DashboardPage = async ( {params} ) => {
    const store = await prisma.store.findFirst({
        where: {
            id: params.storeId
        }
    });


    if(!store) {
        redirect('/');
    }

    return ( 
        <div>Active Store: {store?.name}</div>
     );
}
 
export default DashboardPage;