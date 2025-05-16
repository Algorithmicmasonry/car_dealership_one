"use client";

import React, { useState } from "react";
import SearchManufacturer from "./search-manufacturer";
import SearchButton from "../search/search-button";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast"
import {useRouter, useSearchParams } from "next/navigation"


const SearchBar = () => {
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const formData = new FormData(e.currentTarget)
    const model = formData.get('model')?.toString().toLowerCase() || ''
    const manufacturer = formData.get('manufacturer')?.toString().toLowerCase() || ''

    if (!manufacturer && !model) {
      toast({
        title: "Please Fill in the search bar",
        variant: "destructive"
      })
      return
    }

    updateSearchParams(model, manufacturer)
  }

  const updateSearchParams = (model: string, manufacturer: string) => {
    // Create a new URLSearchParams instance from current search params
    const params = new URLSearchParams(searchParams.toString())

    // Update model parameter
    model ? params.set('model', model) : params.delete('model')
    
    // Update manufacturer parameter
    manufacturer ? params.set('manufacturer', manufacturer) : params.delete('manufacturer')

    // Reset pagination if filters change
    params.delete('page')

    // Construct the new URL
    const newUrl = `${window.location.pathname}?${params.toString()}`

    // Use Next.js router to update the URL
    router.push(newUrl, { scroll: false })
  }

  
  return (
    <form className="searchbar" onSubmit={handleSearch}>
      <div className="searchbar__item">
        <SearchManufacturer
          manufacturer={manufacturer}
          setManufacturer={setManufacturer}
        />

        <SearchButton otherClasses="" />
      </div>

      <div className="searchbar__item">
        <Image
          src="/model-icon.png"
          width={25}
          height={25}
          className="absolute w-[20px] h-[20px] ml-4"
          alt="car model"
        />
        <input
          type="text"
          name="model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="Mercedes Benz"
          className="searchbar__input"
        />
        <SearchButton otherClasses="sm:hidden" />
      </div>
      <SearchButton otherClasses="max-sm:hidden" />
    </form>
  );
};

export default SearchBar;
