"use client";

import { VirtualEstateCard } from "@/src/components/LandCard";
import Pagination from "@/src/components/piday-ui/pagination/Pagination";
import { useGetLatestVirtualEstatesQuery } from "@/src/features/virtual-estate/api/virtualEstateAPI";
import { VirtualEstate } from "@/src/features/virtual-estate/interface/virtual-estate.interface";
import { cn } from "@/src/utils/cn";

import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Select from "@mui/joy/Select";
import Typography from "@mui/joy/Typography";

import { useRouter } from "next/navigation";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {}

export function ForSale({}: Props) {
  const { t } = useTranslation("home");
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);

  const [searchInput, setSearchInput] = useState<string>("");

  const handlePageClick = useCallback(({ selected }: { selected: number }) => {
    setPage(selected + 1);
  }, []);

  const [virtualEstates, setVirtualEstates] = useState<VirtualEstate[]>([]);

  const { data: latestVERes } = useGetLatestVirtualEstatesQuery({
    page: page,
    size: size,
  });

  useEffect(() => {
    setVirtualEstates(latestVERes?.virtualEstates || []);
  }, [latestVERes?.virtualEstates]);

  const handleSearch = useCallback(() => {
    router.push("/search?input=" + searchInput);
  }, [router, searchInput]);

  return (
    <div className={cn("py-10")}>
      <Typography className="text-center font-semibold" level="h4">
        {t("onSaleLand")}
      </Typography>
      <br />
      <Input
        className="[&_.MuiSelect-root]:!border-0 mx-auto !rounded-full [&_.MuiSelect-root]:hover:!bg-transparent max-w-xl"
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
        // startDecorator={
        //   <>
        //     <Select
        //       indicator={
        //         <IconButton
        //           onClick={() => {
        //             handleSearch();
        //           }}
        //         >
        //           <i className="ri-search-line"></i>
        //         </IconButton>
        //       }
        //       placeholder={t("allLand")}
        //     >
        //       <Option value="10">10</Option>
        //       <Option value="20">20</Option>
        //       <Option value="30">30</Option>
        //       <Option value="50">50</Option>
        //     </Select>
        //     <div className="h-4 w-px bg-zinc-300"></div>
        //   </>
        // }
      />
      <br />
      <section className="grid py-6 container-mini grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {(virtualEstates || []).map((ve, index) => (
          <VirtualEstateCard key={index} ve={ve} />
        ))}
      </section>

      <div className="w-full overflow-auto">
        <Pagination
          currentPage={page}
          pageCount={(latestVERes?.totalCount || 0) / size}
          onPageChange={handlePageClick}
        />
      </div>
    </div>
  );
}
