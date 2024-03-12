"use client";

import { VirtualEstateCard } from "@/src/components/LandCard";
import { useGetListedVirtualEstatesQuery } from "@/src/features/virtual-estate/api/virtualEstateAPI";

import Button from "@mui/joy/Button";

import { useState } from "react";

export default function ListedVirtualEstateList() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);

  const { data: listedVirtualEstates } = useGetListedVirtualEstatesQuery({
    page,
    size,
  });

  return (
    <div className="lg:px-16">
      <div className="grid py-6 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {listedVirtualEstates?.map((ve, index) => (
          <div key={index}>
            <VirtualEstateCard ve={ve} />
          </div>
        ))}
      </div>

      <div>
        <Button
          onClick={() => {
            setPage(page + 1);
          }}
        >
          Load more
        </Button>
      </div>
    </div>
  );
}
