import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
    try {
        const { userId } = auth();

        const { name, price, categoryId, sizeId, colorId, images, isFeatured, isArchived } = await request.json();



        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Label is required", { status: 400 });
        }

        if (!price) {
            return new NextResponse("Price is required", { status: 400 });
        }

        if (!categoryId) {
            return new NextResponse("Category id is required", { status: 400 });
        }

        if (!sizeId) {
            return new NextResponse("Size id is required", { status: 400 });
        }

        if (!colorId) {
            return new NextResponse("Color id is required", { status: 400 });
        }

        if (!images || images.length === 0) {
            return new NextResponse("Images are required", { status: 400 });
        }

        // isFeatured and isArchived properties are optional - so no checks needed

        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        const storeByUserId = await prisma.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });


        if (!storeByUserId) { // if user tries to tamper with the store details of another user 
            return new NextResponse("Unauthorized", { status: 403 });
        }


        const product = await prisma.product.create({
            data: {
                name,
                price,
                isFeatured,
                isArchived,
                categoryId,
                sizeId,
                colorId,
                storeId: params.storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map(image => image)
                        ]
                    }
                }
            }
        });

        return NextResponse.json(product);


    } catch (error) {
        console.log('[PRODUCTS_POST]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}



export async function GET(request, { params }) {
    try {

        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const colorId = searchParams.get("colorId") || undefined;
        const sizeId = searchParams.get("sizeId") || undefined;
        const isFeatured = searchParams.get("isFeatured");





        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }


        const products = await prisma.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ?  true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(products);


    } catch (error) {
        console.log('[PRODUCTS_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}