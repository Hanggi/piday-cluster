"use client";

import Button from "@mui/joy/Button";

import ReactPaginate, { ReactPaginateProps } from "react-paginate";

interface Props extends ReactPaginateProps {
  currentPage: number;
}

export default function Pagination({ currentPage, pageCount, ...rest }: Props) {
  return (
    <div>
      <ReactPaginate
        breakLabel={"..."}
        containerClassName="flex justify-center gap-2"
        nextLabel={
          <Button color="neutral" variant="outlined">
            <i className="ri-arrow-right-s-line"></i>
          </Button>
        }
        pageCount={pageCount}
        pageLabelBuilder={(page) => (
          <Button
            color={page == currentPage ? "primary" : "neutral"}
            variant="outlined"
          >
            {page}
          </Button>
        )}
        previousLabel={
          <Button color="neutral" variant="outlined">
            <i className="ri-arrow-left-s-line"></i>
          </Button>
        }
        renderOnZeroPageCount={null}
        {...rest}
      />
    </div>
  );
}
