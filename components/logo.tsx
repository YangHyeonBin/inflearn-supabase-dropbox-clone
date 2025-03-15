"use client";

import Image from "next/image";

export default function Logo() {
    return (
        <div className="flex items-center gap-2">
            <Image
                src="/logo.png"
                alt="Dropbox logo"
                width={100}
                height={100}
                className="!w-6 !h-auto"
            />
            <span className="text-lg font-bold">Dropbox</span>
        </div>
    );
}
