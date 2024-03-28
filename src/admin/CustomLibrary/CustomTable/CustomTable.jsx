import React, { useState, useEffect, useRef } from "react";
import DataTable from "react-data-table-component";
import "./table.css";
const PENALTI = 28;
const COOLDOWN = 1;
// Loading table component.
const LoadingTable = () => {
  // Array to represent 10 rows
  const rows = Array.from({ length: 10 }, (_, index) => index);
  return (
    <>
        <table className="tg">
            <tbody>
            {/* Loop to render 10 table rows */}
            {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                {/* Loop to render 8 cells in each row */}
                {Array.from({ length: 5 }, (_, cellIndex) => (
                    <td key={cellIndex} className="tg-cly1">
                    <div className="line" />
                    </td>
                ))}
                </tr>
            ))}
            </tbody>
        </table>
    </>
  );
};
const CustomTable = (props) => {
  const {
    data, // dataset for render table
    columns, // table column
    selectable, // option for select row column
    handleSelect, // callback function handle row select
    handlePagination, // callback function for handle pagination
    defaultRowsParPage, // default rows per page by user. if not set default is 10
    defaultCurrentPage, // default current page by user. if not set default is 1
    defaultTotalRows, // default total rows for the dataset. user should always provide this.
    perPageOption, // per page option array. user should always provide.
    realtimeFilter, // filter filds for realtime filter.
  } = props;
  const [loading, setLoading] = useState(false); // loading state varaible.
  const [totalRows, setTotalRows] = useState(defaultTotalRows || data.length); // total no of row in dataset.
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsParPage || 10); // rows par page. default is 10.
  const [currentPage, setCurrentPage] = useState(defaultCurrentPage || 1); // current page state variable.
  // Realtime filter state variable
  const [filterData, setFilterData] = useState({});
  // Counter variable for cooldown effect
  const counter = useRef(0);
  const counterId = useRef(0);
  // Get the last fild of column.
  const sortableFild = columns[columns.length - 1];
  // Chek the last column field is dropdown
  // If not dropdown then push the dropdown field to the column.
  if (!sortableFild.isDropDown) {
    columns.push({
      name: "",
      cell: (row) => (
        <div className="dropdown_btn">
          <button onClick={(e) => handleTableExpand(e.currentTarget)}>
            <i class="mvx-table-module module-arrow-right2"></i>
          </button>
        </div>
      ),
      isDropDown: true,
    });
  }
  // Function that handle table expand.
  const handleTableExpand = (e) => {
    e.children[0].classList.toggle('module-arrow-down2');
    e.children[0].classList.toggle('module-arrow-right2');
    const row = e.parentElement.parentElement.parentElement;
    row.classList.toggle("active");
  }
  // When new data comes, set loading to false.
  useEffect(() => {
    setTotalRows(defaultTotalRows);
    setLoading(false);
  }, [data]);
  // Code for handle cooldown effect.
  useEffect(() => {
    // Check if filter data is empty then this effect is for first time rendering.
    // Do nothing in this case.
    if ( Object.keys(filterData).length === 0 ) {
      return;
    }
    // Set counter by penalti
    counter.current = PENALTI;
    // Clear previous counter.
    if (counterId.current) {
      clearInterval(counterId.current);
    }
    // Create new interval
    const intervalId = setInterval(() => {
      counter.current -= COOLDOWN;
      // Cooldown compleate time for db request.
      if (counter.current < 0) {
        // Set the loading
        setLoading(true);
        // Call filter function
        handlePagination?.(rowsPerPage, 1, filterData);
        // Set current page to one.
        setCurrentPage(1);
        // Clear the interval.
        clearInterval(intervalId);
        counterId.current = 0;
      }
    }, 50);
    // Store the interval id.
    counterId.current = intervalId;
  }, [filterData]);
  // Handle mouse enter function.
  const handleMouseEnter = () => {
    props.handleMouseEnter?.();
  };
  // Handle mouse leave function.
  const handleMouseLeave = () => {
    props.handleMouseLeave?.();
  };
  const handlePageChange = async (newCurrentPage) => {
    // Start the loading...
    setLoading(true);
    // Call the function for handle pagination.
    handlePagination?.(rowsPerPage, newCurrentPage, filterData);
    // Set state variable
    setCurrentPage(newCurrentPage);
  };
  // Function handle rows-per-page change.
  const handleRowsPerPageChange = async (newRowsPerPage) => {
    // Start the loading...
    setLoading(true);
    // Call the function for handle pagination.
    handlePagination?.(newRowsPerPage, currentPage, filterData);
    // Set state variable.
    setCurrentPage(1);
    setRowsPerPage(newRowsPerPage);
  };
  // Function handle selected row change.
  const handleOnSelectedRowsChange = async ({
    selectedRows,
    selectedCount,
    allSelected,
  }) => {
    // Check if any row is select or not.
    // Prevent extra call on page change.
    if (selectedCount > 0) {
      handleSelect?.(selectedRows, selectedCount, allSelected);
    }
  };
  // Function that handle filter change.
  const handleFilterChange = ( key, value ) => {
    // Set filter data
    setFilterData((prevData) => {
      return {
        ...prevData,
        [key]: value,
      };
    });
  };
  return (
    <div className={`table-container ${loading ? "table-loading" : ""} ${selectable ? "selectable-table" : ""}`}>
      <div className="woo-wrap-bulk-all-date">
        {/* Render realtime filter */}
        {realtimeFilter &&
          realtimeFilter.map((filter) => {
            return filter.render(handleFilterChange, filterData[filter.name]);
          })}
      </div>
      {loading ? (
        <LoadingTable />
      ) : (
        <DataTable
          pagination
          paginationServer
          selectableRows={selectable}
          columns={columns}
          data={data}
          // Pagination details.
          paginationTotalRows={totalRows}
          paginationDefaultPage={currentPage}
          paginationPerPage={rowsPerPage}
          paginationRowsPerPageOptions={perPageOption}
          // Mouse enter leave callback.
          onRowMouseEnter={handleMouseEnter}
          onRowMouseLeave={handleMouseLeave}
          // Pagination callback.
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          // Row select callback.
          onSelectedRowsChange={handleOnSelectedRowsChange}
        />
      )}
    </div>
  );
};

export default CustomTable;