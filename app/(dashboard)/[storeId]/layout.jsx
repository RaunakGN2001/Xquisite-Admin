import Navbar from "@/components/navbar";
import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";


export default async function DashboardLayout({children ,params}) {
    const { userId } = auth();



    if(!userId) { 
        // no user id means registration or sign in has not been done
        redirect('/sign-in');
    }  


    const store = await prisma.store.findFirst({
        where: {
            id: params.storeId,
            userId
        }
    });

    if(!store) {
        redirect('/');
    }



    return  (
        <>
            <Navbar />
            {children}
        </>
    )

}   

