"use client";

import { VirtualEstateCard } from "@/src/components/LandCard";
import {
  useGetListedVirtualEstatesQuery,
  useGetTransactedVirtualEstatesQuery,
} from "@/src/features/virtual-estate/api/virtualEstateAPI";
import { VirtualEstate } from "@/src/features/virtual-estate/interface/virtual-estate.interface";

import Button from "@mui/joy/Button";
import Tab from "@mui/joy/Tab";
import TabList from "@mui/joy/TabList";
import TabPanel from "@mui/joy/TabPanel";
import Tabs from "@mui/joy/Tabs";

import { useEffect, useState } from "react";

export default function ListedVirtualEstateList() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [type, setType] = useState<string | null>("listed");

  const [listingVirtualEstates, setListingVirtualEstates] = useState<
    VirtualEstate[]
  >([]);
  const [transactedVirtualEstates, setTransactedVirtualEstates] = useState<
    VirtualEstate[]
  >([]);

  const { data: listedVirtualEstateList } = useGetListedVirtualEstatesQuery({
    page,
    size,
  });
  useEffect(() => {
    if (listedVirtualEstateList) {
      setListingVirtualEstates(listedVirtualEstateList);
    }
  }, [listedVirtualEstateList]);

  const { data: transactedVirtualEstateList } =
    useGetTransactedVirtualEstatesQuery({
      page,
      size,
    });

  useEffect(() => {
    if (transactedVirtualEstateList) {
      setTransactedVirtualEstates(transactedVirtualEstateList);
    }
  }, [transactedVirtualEstateList]);

  return (
    <div className="lg:px-16 py-8">
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
          <div className="grid py-6 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listingVirtualEstates?.map((ve, index) => (
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
        </TabPanel>

        <TabPanel value="transacted">
          <div className="grid py-6 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {transactedVirtualEstates?.map((ve, index) => (
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
        </TabPanel>
      </Tabs>
    </div>
  );
}
