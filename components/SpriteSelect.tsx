"use client";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { Button } from "./ui/button";
import { SetStateAction, useState } from "react";

interface Props {
    options: string[];
    prefix: string;
    optionsIdx: number;
    setOptionsIdx: React.Dispatch<SetStateAction<number>>;
}

export default function SpriteSelect({ options, prefix, optionsIdx, setOptionsIdx }: Props) {
    const handleChange = (e: React.MouseEvent<HTMLButtonElement>, direction: 'right' | 'left') => {
        e.preventDefault();
        if(direction === 'right') {
            setOptionsIdx(prev => prev === options.length - 1 ? 0 : prev + 1);
        } else {
            setOptionsIdx(prev => prev === 0 ? options.length - 1 : prev - 1);
        }
    }

    return (
        <div className="flex items-center">
            <Button onClick={(e) => handleChange(e, 'left')}>Left!</Button>
            <Image src={`${prefix}${options[optionsIdx]}`} alt='morgana' width={100} height={100} />
            <Button onClick={(e) => handleChange(e, 'right')}>Right!</Button>
        </div>
    );
}