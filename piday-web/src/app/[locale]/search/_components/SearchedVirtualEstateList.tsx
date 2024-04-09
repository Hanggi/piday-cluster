"use client";

import { VirtualEstateCard } from "@/src/components/LandCard";
import { useLazySearchVirtualEstatesQuery } from "@/src/features/virtual-estate/api/virtualEstateAPI";
import { isEmpty } from "lodash";

import CircularProgress from "@mui/joy/CircularProgress";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";

import { useSearchParams } from "next/navigation";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function SearchedVirtualEstateList() {
  const { t } = useTranslation("home");
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState<string>(
    searchParams.get("input") as string,
  );

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);

  const [searchVEs, { data: virtualEstates, isFetching }] =
    useLazySearchVirtualEstatesQuery();

  const handleSearch = useCallback(() => {
    searchVEs({
      name: searchInput,
      size,
      page,
    });
  }, [page, searchInput, searchVEs, size]);

  useEffect(() => {
    if (searchParams.get("input")) {
      handleSearch();
    }
    // Search when the page is loaded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="lg:px-16 py-8">
      <div className="mb-8">
        <Input
          className="[&_.MuiSelect-root]:!border-0 mx-auto !rounded-full [&_.MuiSelect-root]:hover:!bg-transparent max-w-xl"
          defaultValue={searchInput}
          endDecorator={
            <IconButton
              onClick={() => {
                handleSearch();
              }}
            >
              <i className="ri-search-line"></i>
            </IconButton>
          }
          placeholder={t("enterLandToQuery")}
          size="lg"
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
      </div>

      <div>
        {isFetching && (
          <div className="w-full flex justify-center">
            <CircularProgress />
          </div>
        )}
        <div className="grid py-6 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {virtualEstates?.map((ve, index) => (
            <div key={index}>
              <VirtualEstateCard ve={ve} />
            </div>
          ))}
        </div>
        {isEmpty(virtualEstates) && !isFetching && (
          <div className="text-center">
            <p className="text-2xl text-gray-400">No search result</p>
          </div>
        )}
      </div>
    </div>
  );
}
