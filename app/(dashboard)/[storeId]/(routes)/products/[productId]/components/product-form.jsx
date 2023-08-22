'use client'

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from 'react';
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modals/alert-modal";
import APIAlert from "@/components/ui/api-alert";
import useOrigin from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/image-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";



const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({ url: z.string() }).array(),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    sizeId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),

});



const ProductForm = ({ categories, colors, sizes, initialData }) => {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();


    const title = initialData ? 'Edit product' : 'Create product';
    const description = initialData ? 'Edit a product' : 'Add a new product';
    const toastMessage = initialData ? 'Product updated.' : 'Product created.';
    const action = initialData ? 'Save changes' : 'Create';



    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            price: parseFloat(String(initialData?.price)),
        } : {
            name: '',
            images: [],
            price: 0,
            categoryId: '',
            colorId: '',
            sizeId: '',
            isFeatured: false,
            isArchived: false,
        }
    });

    const onSubmit = async (data) => {



        try {
            setLoading(true);

            if (initialData) {
                const response = await fetch(`/api/${params.storeId}/products/${params.productId}`, {
                    'method': 'PATCH',
                    'headers': {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })

                // console.log('PATCH -----', response);

                if (!response.ok) {
                    toast.error('Network response not ok');
                    throw new Error('Network response was not ok');
                }

                router.refresh();   
                router.push(`/${params.storeId}/products`);

                toast.success(toastMessage);


            }
            else {
                const response = await fetch(`/api/${params.storeId}/products`, {
                    'method': 'POST',
                    'headers': {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })


                // console.log('POST -----', response);

                if (!response.ok) {
                    toast.error('Network response not ok');
                    throw new Error('Network response was not ok');
                }

                router.refresh();
                router.push(`/${params.storeId}/products`);

                toast.success(toastMessage);
            }


        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    }


    const onDelete = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/${params.storeId}/products/${params.productId}`, {
                'method': 'DELETE',
                'headers': {
                    'Content-type': 'application/json',
                },
            });

            router.refresh();
            router.push(`/${params.storeId}/products`);
            toast.success('Product deleted');


        } catch (error) {   
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
            <div className='flex items-center justify-between'>
                <Heading title={title} description={description} />
                {initialData &&
                    <Button variant='destructive' size='sm' onClick={() => { setOpen(true) }}>
                        <Trash className='h-4 w-4' />
                    </Button>
                }
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
                    <FormField control={form.control} name='images' render={({ field }) => (
                        <FormItem>
                            <FormLabel>Images</FormLabel>
                            <FormControl>
                                <ImageUpload value={field.value.map(image => image.url)} disabled={loading} onChange={(url) => field.onChange([...field.value, { url }])} onRemove={(url) => field.onChange([...field.value.filter(current => current.url !== url)])} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <div className='grid grid-cols-3 gap-8'>
                        <FormField control={form.control} name='name' render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='Product name' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name='price' render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input type='number' disabled={loading} placeholder='9.99' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name='categoryId' render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} placeholder='Select a category' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map(category => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name='sizeId' render={({ field }) => (
                            <FormItem>
                                <FormLabel>Size</FormLabel>
                                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} placeholder='Select a size' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {sizes.map(size => (
                                            <SelectItem key={size.id} value={size.id}>
                                                {size.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />


                        <FormField control={form.control} name='colorId' render={({ field }) => (
                            <FormItem>
                                <FormLabel>Color</FormLabel>
                                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} placeholder='Select a color' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {colors.map(color => (
                                            <SelectItem key={color.id} value={color.id}>
                                                {color.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />


                        <FormField control={form.control} name='isFeatured' render={({ field }) => (
                            <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                                <FormControl>
                                    <Checkbox checked={field.value}
                                        onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className='space-y-1 leading-none'>
                                    <FormLabel>
                                        Featured
                                    </FormLabel>
                                    <FormDescription>
                                        This product will appear on the homepage
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name='isArchived' render={({ field }) => (
                            <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                                <FormControl>
                                    <Checkbox checked={field.value}
                                        onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className='space-y-1 leading-none'>
                                    <FormLabel>
                                        Archived
                                    </FormLabel>
                                    <FormDescription>
                                        This product will not appear anywhere on the store
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )} />


                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    );
}

export default ProductForm;