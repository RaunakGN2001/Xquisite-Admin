import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
    try {
        const { userId } = auth();
        
        const { name, billboardId } = await request.json();
        
        

        if(!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if(!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if(!billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 });
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


        const category = await prisma.category.create({
            data: {
                name,
                billboardId,
                storeId: params.storeId
            }
        }); 

        return NextResponse.json(category);


    } catch(error) {
        console.log('[CATEGORIES_POST]', error);
        return new NextResponse("Internal Error", { status: 500});
    }
}



export async function GET(request, { params }) {
    try {
        
        if(!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }


        const categories = await prisma.category.findMany({
            where: {
                storeId: params.storeId
            }
        }); 

        return NextResponse.json(categories);


    } catch(error) {
        console.log('[CATEGORIES_GET]', error);
        return new NextResponse("Internal Error", { status: 500});
    }
}