"use client";

import FileDropzone from "components/FileDropzone";
import SearchInput from "components/SearchInput";
import Logo from "components/logo";
import FileList from "components/FileList";
import { useState } from "react";

export default function Ui() {
    const [searchInput, setSearchInput] = useState("");

    return (
        <main className="flex flex-col w-full gap-4 p-4">
            {/* logo */}
            <Logo />

            {/* search input */}
            <SearchInput
                searchInput={searchInput}
                setSearchInput={setSearchInput}
            />

            {/* file dropzone */}
            <FileDropzone />

            {/* file list */}
            <FileList searchInput={searchInput} />
        </main>
    );
}
