'use client'

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from 'react';
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modals/alert-modal";
import APIAlert from "@/components/ui/api-alert";
import useOrigin from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/image-upload";



const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1),
});

 

const SizeForm = ({ initialData }) => {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false); 
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();


    const title = initialData ? 'Edit size' : 'Create size';
    const description = initialData ? 'Edit a size' : 'Add a new size';
    const toastMessage = initialData ? 'Size updated.' : 'Size created.';
    const action = initialData ? 'Save changes' : 'Create';



    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: ''
        }
    })
 
    const onSubmit = async (data) => {



        try {
            setLoading(true);

            if(initialData) {
                const response = await fetch(`/api/${params.storeId}/sizes/${params.sizeId}`, {
                    'method': 'PATCH',
                    'headers': {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })

                // console.log('PATCH -----', response);

                if(!response.ok) {
                    toast.error('Network response not ok');
                    throw new Error('Network response was not ok');
                }

                router.refresh();
                router.push(`/${params.storeId}/sizes`);

                toast.success(toastMessage);


            }
            else {
                const response = await fetch(`/api/${params.storeId}/sizes`, {
                    'method': 'POST',
                    'headers': {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })


                // console.log('POST -----', response);

                if(!response.ok) {
                    toast.error('Network response not ok');
                    throw new Error('Network response was not ok');
                }

                router.refresh();
                router.push(`/${params.storeId}/sizes`);

                toast.success(toastMessage);
            }
            

        } catch(error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    }


    const onDelete = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/${params.storeId}/sizes/${params.sizeId}`, {
                'method': 'DELETE',
                'headers': {
                    'Content-type': 'application/json',
                },
            });

            router.refresh();
            router.push(`/${params.storeId}/sizes`);
            toast.success('Size deleted');


        } catch(error) {
            toast.error('Make sure you removed all products using this size first');
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
                    <Button variant='destructive' size='sm' onClick={() => {setOpen(true)}}>
                        <Trash className='h-4 w-4' />
                    </Button>
                }
            </div>
            <Separator />
            <Form {...form}>
                 <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
                        
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField control={form.control} name='name' render={( { field } ) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='Size name' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name='value' render={( { field } ) => (
                            <FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='Size value' {...field} />
                                </FormControl>
                                <FormMessage />
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

export default SizeForm;