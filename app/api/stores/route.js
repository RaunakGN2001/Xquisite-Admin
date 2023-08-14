import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = auth();
        const { name } = await request.json();
        

        console.log(name);

        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(!name) {
            return new NextResponse("Name is required", { status: 400 });
        }
        
        const store = await prisma.store.create({
            data: {
                name,
                userId
            }
        }); 

        return NextResponse.json(store);


    } catch(error) {
        console.log('[STORES_POST]', error);
        return new NextResponse("Internal Error", { status: 500});
    }
}