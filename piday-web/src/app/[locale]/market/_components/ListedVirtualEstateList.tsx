"use client";

import { VirtualEstateCard } from "@/src/components/LandCard";
import Pagination from "@/src/components/piday-ui/pagination/Pagination";
import {
  useGetListedVirtualEstatesQuery,
  useGetTransactedVirtualEstatesQuery,
} from "@/src/features/virtual-estate/api/virtualEstateAPI";
import { VirtualEstate } from "@/src/features/virtual-estate/interface/virtual-estate.interface";

import CircularProgress from "@mui/joy/CircularProgress";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Tab from "@mui/joy/Tab";
import TabList from "@mui/joy/TabList";
import TabPanel from "@mui/joy/TabPanel";
import Tabs from "@mui/joy/Tabs";

import { useCallback, useEffect, useState } from "react";

export default function ListedVirtualEstateList() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
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

  const { data: listedVirtualEstateList, isFetching: isFetchingListed } =
    useGetListedVirtualEstatesQuery({
      page,
      size,
      sort,
    });

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
    <div className="lg:px-16 py-8">
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

          <div className="grid py-6 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listingVirtualEstates?.map((ve, index) => (
              <div key={index}>
                <VirtualEstateCard ve={ve} showLastPrice={true} />
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
          <div className="grid py-6 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
