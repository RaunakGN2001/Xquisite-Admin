import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";



export async function GET(request, { params }) {
    try {

        if(!params.categoryId) {
            return new NextResponse('Category id is required', { status: 400 });
        } 


        const category = await prisma.category.findUnique({
            where: {
                id: params.categoryId,
            }
        });


        return NextResponse.json(category);

    } catch (error) {   
        console.log('[CATEGORY_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(request, { params }) {
    try {
        const { userId } = auth();
        const { name, billboardId } = await request.json();


        if(!userId) {
            return new NextResponse('Unauthenticated', { status: 401 } );
        }


        if(!name) {
            return new NextResponse('Name is required', { status: 400 });
        }

        if(!billboardId) {
            return new NextResponse('Billboard id is required', { status: 400 });
        }


        if(!params.categoryId) {
            return new NextResponse('Category id is required', { status: 400 });
        }

        const storeByUserId = await prisma.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if(!storeByUserId) {
            return new NextResponse('Unauthorized', {status: 403});
        }
        
        const category = await prisma.category.updateMany({
            where: {
                id: params.categoryId,
            },
            data: {
                name,
                billboardId
            }
        });


        return NextResponse.json(category);

    } catch (error) {
        console.log('[CATEGORY_PATCH]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { userId } = auth();


        if(!userId) {
            return new NextResponse('Unauthenticated', { status: 401 } );
        }



        if(!params.categoryId) {
            return new NextResponse('Category id is required', { status: 400 });
        }

        const storeByUserId = await prisma.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if(!storeByUserId) {
            return new NextResponse('Unauthorized', {status: 403});
        }


        const category = await prisma.category.deleteMany({
            where: {
                id: params.categoryId,
            }
        })


        return NextResponse.json(category);

    } catch (error) {   
        console.log('[CATEGORY_DELETE]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}