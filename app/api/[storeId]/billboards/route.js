import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
    try {
        const { userId } = auth();
        
        const { label, imageUrl } = await request.json();
        
        

        if(!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if(!label) {
            return new NextResponse("Label is required", { status: 400 });
        }

        if(!imageUrl) {
            return new NextResponse("Image URL is required", { status: 400 });
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


        const billboard = await prisma.billBoard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }
        }); 

        return NextResponse.json(billboard);


    } catch(error) {
        console.log('[BILLBOARDS_POST]', error);
        return new NextResponse("Internal Error", { status: 500});
    }
}



export async function GET(request, { params }) {
    try {
        
        if(!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }


        const billboards = await prisma.billBoard.findMany({
            where: {
                storeId: params.storeId
            }
        }); 

        return NextResponse.json(billboards);


    } catch(error) {
        console.log('[BILLBOARDS_GET]', error);
        return new NextResponse("Internal Error", { status: 500});
    }
}