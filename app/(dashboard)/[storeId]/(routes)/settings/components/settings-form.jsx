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


const formSchema = z.object({
    name: z.string().min(1),
});

 

const SettingsForm = ({ initialData }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false); 
    const params = useParams();
    const router = useRouter();


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    })
 
    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/stores/${params.storeId}`, {
                'method': 'PATCH',
                'headers': {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if(!response.ok) {
                toast.error('Network response not ok');
                throw new Error('Network response was not ok');
            }



            router.refresh();

            toast.success('Store updated');

        } catch(error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    }


    const onDelete = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/stores/${params.storeId}`, {
                'method': 'DELETE',
                'headers': {
                    'Content-type': 'application/json',
                },
            });

            router.refresh();
            router.push('/');
            toast.success('Store deleted');


        } catch(error) {
            toast.error('Make sure you removed all products and categories first.');
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>  
            <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
            <div className='flex items-center justify-between'>
                <Heading title='Settings' description='Manage store preferences' />
                <Button variant='destructive' size='sm' onClick={() => {setOpen(true)}}>
                    <Trash className='h-4 w-4' />
                </Button>
            </div>
            <Separator />
            <Form {...form}>
                 <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField control={form.control} name='name' render={( { field } ) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='Store name' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>
                        Save changes
                    </Button>
                 </form>
            </Form>
        </>
    );
}

export default SettingsForm;