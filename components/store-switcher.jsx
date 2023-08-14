'use client'

import { UseStoreModal } from "@/hooks/use-store-modal";
import { useParams, useRouter } from "next/navigation";
import { useState } from 'react';
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { PopoverContent } from "@radix-ui/react-popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { CommandSeparator } from "cmdk";

const StoreSwitcher = ( {className, items = []} ) => {

    const StoreModal = UseStoreModal();
    const params = useParams();
    const router = useRouter();

    const formattedItems = items.map(item => ({
        label: item.name,
        value: item.id
    }))

    const currentStore = formattedItems.find(item => item.value === params.storeId);

    const [open, setOpen] = useState(false);

    const onStoreSelect = (store) => {
        setOpen(false);
        router.push(`/${store.value}`);
    }

    return ( 
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant='outline' size='sm' role='combobox' aria-expanded={open} aria-label='Select a store' className={cn('w-[200px] justify-between', className)}>
                    <StoreIcon className='mr-2 h-4 w-4' />
                    {currentStore.label}
                    <ChevronsUpDown className='ml-auto h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0'>
                <Command className='mt-1 rounded-lg border shadow-md'>
                    <CommandList>
                        <CommandInput placeholder='Search Store...' />
                        <CommandEmpty>No store found</CommandEmpty>
                        <CommandGroup heading='Store'>
                            {formattedItems.map(store => (
                                <CommandItem key={store.value} onSelect={() => onStoreSelect(store)} className='text-sm'>
                                    <StoreIcon className='mr-2 h-4 w-4' />
                                    {store.label}
                                    <Check className={cn('ml-auto h-4 w-4', currentStore?.value === store.value ? 'opacity-100' : 'opacity-0')} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator />
                    <CommandList>
                        <CommandGroup>
                            <CommandItem onSelect={() => {
                                setOpen(false);
                                StoreModal.onOpen();
                                }}
                                >
                                    <PlusCircle className='mr-2 h-5 w-5' />
                                    Create Store
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
     );
}
 
export default StoreSwitcher;