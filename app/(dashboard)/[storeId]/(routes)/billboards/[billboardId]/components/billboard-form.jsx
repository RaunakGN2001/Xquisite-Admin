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
    label: z.string().min(1),
    imageUrl: z.string().min(1),
});

 

const BillboardForm = ({ initialData }) => {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false); 
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();


    const title = initialData ? 'Edit billboard' : 'Create billboard';
    const description = initialData ? 'Edit a billboard' : 'Add a new billboard';
    const toastMessage = initialData ? 'Billboard updated.' : 'Billboard created.';
    const action = initialData ? 'Save changes' : 'Create';



    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: '',
            imageUrl: ''
        }
    })
 
    const onSubmit = async (data) => {
        // console.log(data);

        try {
            setLoading(true);
            if(initialData) {
                const response = await fetch(`/api/${params.storeId}/billboards/${params.billboardId}`, {
                    'method': 'PATCH',
                    'headers': {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
            }
            else {
                const response = await fetch(`/api/${params.storeId}/billboards`, {
                    'method': 'POST',
                    'headers': {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
            }
            

            if(!response.ok) {
                toast.error('Network response not ok');
                throw new Error('Network response was not ok');
            }



            router.refresh();

            toast.success(toastMessage);

        } catch(error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    }


    const onDelete = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/${params.storeId}/billboards/${params.billboardId}`, {
                'method': 'DELETE',
                'headers': {
                    'Content-type': 'application/json',
                },
            });

            router.refresh();
            router.push('/');
            toast.success('Billboard deleted');


        } catch(error) {
            toast.error('Make sure you removed all categories using this billboard first');
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
                    
                        <FormField control={form.control} name='imageUrl' render={( { field } ) => (
                            <FormItem>
                                <FormLabel>Background image</FormLabel>
                                <FormControl>
                                    <ImageUpload value={field.value ? [field.value] : []} disabled={loading} onChange={(url) => field.onChange(url)} onRemove={() => field.onChange("")}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField control={form.control} name='name' render={( { field } ) => (
                            <FormItem>
                                <FormLabel>Label</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='Billboard label ' {...field} />
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
            <Separator />
        </>
    );
}

export default BillboardForm;