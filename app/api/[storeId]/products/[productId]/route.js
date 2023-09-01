import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";



export async function GET(request, { params }) {
    try {

        if (!params.productId) {
            return new NextResponse('Product id is required', { status: 400 });
        }


        const product = await prisma.product.findUnique({
            where: {
                id: params.productId,
            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true,
            }
        });


        return NextResponse.json(product);

    } catch (error) {
        console.log('[PRODUCT_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(request, { params }) {
    try {
        const { userId } = auth();
        const { name, price, categoryId, sizeId, colorId, images, isFeatured, isArchived } = await request.json();


        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        if (!params.productId) {
            return new NextResponse('Product id is required', { status: 400 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
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



        const storeByUserId = await prisma.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse('Unauthorized', { status: 403 });
        }   


        // first the previous set of images are being deleted
        await prisma.product.update({
            where: {
                id: params.productId,
            },
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
                    deleteMany: {}
                }
            }
        });

        // then the new set of images are being loaded / updated
        const product = await prisma.product.update({
            where: {
                id: params.productId,
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map(image => image),
                        ]
                    }
                }
            }
        })

        return NextResponse.json(product);

    } catch (error) {
        console.log('[PRODUCT_PATCH]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { userId } = auth();


        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }



        if (!params.productId) {
            return new NextResponse('Product id is required', { status: 400 });
        }

        const storeByUserId = await prisma.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse('Unauthorized', { status: 403 });
        }


        const product = await prisma.product.deleteMany({
            where: {
                id: params.productId,
            }
        })


        return NextResponse.json(product);

    } catch (error) {
        console.log('[PRODUCT_DELETE]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}