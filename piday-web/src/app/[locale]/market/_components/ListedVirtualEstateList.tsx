"use client";

import { VirtualEstateCard } from "@/src/components/LandCard";
import Pagination from "@/src/components/piday-ui/pagination/Pagination";
import {
  useGetListedVirtualEstatesQuery,
  useGetTransactedVirtualEstatesQuery,
} from "@/src/features/virtual-estate/api/virtualEstateAPI";
import { VirtualEstate } from "@/src/features/virtual-estate/interface/virtual-estate.interface";
import { set } from "lodash";

import CircularProgress from "@mui/joy/CircularProgress";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Tab from "@mui/joy/Tab";
import TabList from "@mui/joy/TabList";
import TabPanel from "@mui/joy/TabPanel";
import Tabs from "@mui/joy/Tabs";

import { useRouter, useSearchParams } from "next/navigation";

import { useCallback, useEffect, useState } from "react";

export default function ListedVirtualEstateList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [size, setSize] = useState(window?.innerWidth <= 768 ? 30 : 60);
  const [type, setType] = useState<string | null>("listed");
  const [sort, setSort] = useState("LATEST");

  const [listingVirtualEstates, setListingVirtualEstates] = useState<
    VirtualEstate[]
  >([]);
  const [transactedVirtualEstates, setTransactedVirtualEstates] = useState<
    VirtualEstate[]
  >([]);

  const [totalCountListed, setTotalCountListed] = useState<number>(0);
  const [totalCountTransacted, setTotalCountTransacted] = useState<number>(0);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());

    router.replace(`?${params.toString()}`);
  }, [page]);

  const {
    data: listedVirtualEstateList,
    isFetching: isFetchingListed,
    refetch: refetchListedVEList,
  } = useGetListedVirtualEstatesQuery({
    page,
    size,
    sort,
  });

  useEffect(() => {
    if (
      listedVirtualEstateList?.totalCount &&
      listedVirtualEstateList.totalCount > 0 &&
      page * size > listedVirtualEstateList.totalCount
    ) {
      // Jump to the first page
      router.replace(`?page=1`);
      setPage(1);
      refetchListedVEList();
    }
  }, [listedVirtualEstateList, page, size, router]);

  useEffect(() => {
    if (listedVirtualEstateList) {
      setListingVirtualEstates(listedVirtualEstateList.virtualEstates);
      setTotalCountListed(listedVirtualEstateList.totalCount);
    }
  }, [listedVirtualEstateList]);

  const {
    data: transactedVirtualEstateList,
    isFetching: isFetchingTransacted,
  } = useGetTransactedVirtualEstatesQuery({
    page,
    size,
    sort,
  });

  const handlePageClick = useCallback(({ selected }: { selected: number }) => {
    setPage(selected + 1);
  }, []);

  const handleSortChange = (
    event: React.SyntheticEvent | null,
    newValue: string | null,
  ) => {
    setSort(newValue as string);
  };

  useEffect(() => {
    if (transactedVirtualEstateList) {
      setTransactedVirtualEstates(transactedVirtualEstateList.virtualEstates);
      setTotalCountTransacted(transactedVirtualEstateList.totalCount);
    }
  }, [transactedVirtualEstateList]);

  return (
    <div className="lg:px-4 xl:px-8 py-8">
      <div className="flex justify-between items-center mb-4">
        <Select defaultValue={sort} onChange={handleSortChange}>
          <Option value="LATEST">Latest</Option>
          <Option value="LOWEST_PRICE">Lowest Price</Option>
          <Option value="HIGHEST_PRICE">Highest Price</Option>
        </Select>
      </div>
      <Tabs
        defaultValue="listed"
        orientation="horizontal"
        size="lg"
        onChange={(event, newValue) => {
          setPage(1);
          setType(newValue as string);
        }}
      >
        <TabList>
          <Tab color="neutral" value="listed" variant="plain">
            热门在售
          </Tab>

          <Tab color="neutral" value="transacted" variant="plain">
            热门成交
          </Tab>
        </TabList>

        <TabPanel value="listed">
          {isFetchingListed && (
            <div className="w-full flex justify-center">
              <CircularProgress />
            </div>
          )}

          <div className="grid py-6 grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {listingVirtualEstates?.map((ve, index) => (
              <div key={index}>
                <VirtualEstateCard ve={ve} showLastPrice={false} />
              </div>
            ))}
          </div>

          <div>
            <div className="w-full overflow-auto">
              <Pagination
                currentPage={page}
                pageCount={Math.ceil((totalCountListed || 0) / size)}
                onPageChange={handlePageClick}
              />
            </div>
          </div>
        </TabPanel>

        <TabPanel value="transacted">
          {isFetchingTransacted && (
            <div className="w-full flex justify-center">
              <CircularProgress />
            </div>
          )}
          <div className="grid py-6 grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {transactedVirtualEstates?.map((ve, index) => (
              <div key={index}>
                <VirtualEstateCard ve={ve} showLastPrice={true} />
              </div>
            ))}
          </div>

          <div>
            <div className="w-full overflow-auto">
              <Pagination
                currentPage={page}
                pageCount={Math.ceil((totalCountTransacted || 0) / size)}
                onPageChange={handlePageClick}
              />
            </div>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}
