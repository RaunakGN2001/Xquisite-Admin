"use client";

import { UseStoreModal } from "@/hooks/use-store-modal";
import { Modal } from '@/components/ui/modal';
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from "axios";



const formSchema = z.object({
    name: z.string().min(1),
});


const StoreModal = () => {
    const [loading, setLoading] = useState(false);

    const storeModalIsOpen = UseStoreModal(state => state.isOpen);
    const storeModalonClose = UseStoreModal(state => state.onClose);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });


    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const response = await fetch('/api/stores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if(!response.ok) {
                toast.error('Network response not ok')
                throw new Error('Network response was not ok');
            }
            
            const responseData = await response.json();

            toast.success('Store created');
            window.location.assign(`/${responseData}`)

            // console.log(responseData);

        } catch(error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            title={'Create Store'}
            description={'Add a new store to manage products and categories'}
            isOpen={storeModalIsOpen}
            onClose={storeModalonClose}
        >
            <div>
                <div className='space-y-4 py-2 pb-4'>   
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField 
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='E-Commerce' {...field} />
                                    </FormControl>
                                    <FormMessage errors={form.formState.errors} name='name' />
                                </FormItem>
                            )} />
                            <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                                <Button disabled={loading} variant='outline' onClick={storeModalonClose}>Cancel</Button>
                                <Button disabled={loading} type='submit'>Continue</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    )
}

export default StoreModal;