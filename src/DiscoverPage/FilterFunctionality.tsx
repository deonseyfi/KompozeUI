import { RowData } from "./StickyHeadTable";

export interface FilterState {
  sortByAccuracy: boolean;
  selectedTimeframes: string[];
}

export interface FilterFunctions {
  applyFilters: (rows: RowData[], filterState: FilterState) => RowData[];
  sortByAccuracy: (rows: RowData[]) => RowData[];
  filterByTimeframes: (
    rows: RowData[],
    selectedTimeframes: string[]
  ) => RowData[];
}

/**
 * Sorts rows by accuracy from highest to lowest
 */
export const sortByAccuracy = (rows: RowData[]): RowData[] => {
  return [...rows].sort((a, b) => b.accuracy - a.accuracy);
};

/**
 * Filters rows based on selected timeframes
 */
export const filterByTimeframes = (
  rows: RowData[],
  selectedTimeframes: string[]
): RowData[] => {
  if (selectedTimeframes.length === 0) {
    return rows; // Return all rows if no timeframes selected
  }

  return rows.filter((row) => selectedTimeframes.includes(row.timeframe));
};

/**
 * Applies all filters based on the current filter state
 */
export const applyFilters = (
  rows: RowData[],
  filterState: FilterState
): RowData[] => {
  let filteredRows = [...rows];

  // Apply timeframe filtering first
  if (filterState.selectedTimeframes.length > 0) {
    filteredRows = filterByTimeframes(
      filteredRows,
      filterState.selectedTimeframes
    );
  }

  // Apply accuracy sorting if enabled
  if (filterState.sortByAccuracy) {
    filteredRows = sortByAccuracy(filteredRows);
  }

  return filteredRows;
};

/**
 * Resets filter state to default values
 */
export const getDefaultFilterState = (): FilterState => ({
  sortByAccuracy: false,
  selectedTimeframes: [],
});

/**
 * Checks if any filters are currently active
 */
export const hasActiveFilters = (filterState: FilterState): boolean => {
  return (
    filterState.sortByAccuracy || filterState.selectedTimeframes.length > 0
  );
};

/**
 * Gets a description of currently active filters for display purposes
 */
export const getActiveFilterDescription = (
  filterState: FilterState
): string => {
  if (!hasActiveFilters(filterState)) {
    return "No filters applied";
  }

  const descriptions = [];

  if (filterState.sortByAccuracy) {
    descriptions.push("Sorted by accuracy (highest to lowest)");
  }

  if (filterState.selectedTimeframes.length > 0) {
    const timeframes = filterState.selectedTimeframes.join(", ");
    descriptions.push(`Filtered by timeframes: ${timeframes}`);
  }

  return descriptions.join(" • ");
};
