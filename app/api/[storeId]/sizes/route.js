import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
    try {
        const { userId } = auth();
         
        const { name, value } = await request.json();
        
        

        if(!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if(!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if(!value) {
            return new NextResponse("Value is required", { status: 400 });
        }
        
        if(!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        const storeByUserId = await prisma.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });


        if(!storeByUserId) { // if user tries to tamper with the store details of another user 
            return new NextResponse("Unauthorized", {status: 403});
        }


        const size = await prisma.billBoard.create({
            data: {
                name,
                value,
                storeId: params.storeId
            }
        }); 

        return NextResponse.json(size);


    } catch(error) {
        console.log('[SIZES_POST]', error);
        return new NextResponse("Internal Error", { status: 500});
    }
}



export async function GET(request, { params }) {
    try {
        
        if(!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }


        const sizes = await prisma.size.findMany({
            where: {
                storeId: params.storeId
            }
        }); 

        return NextResponse.json(sizes);


    } catch(error) {
        console.log('[SIZES_GET]', error);
        return new NextResponse("Internal Error", { status: 500});
    }
}