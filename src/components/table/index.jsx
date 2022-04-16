import { createContext, useContext, useEffect, useReducer } from 'react';
import useApi, {
	fetchPeople,
	PEOPLE_ATTRIBUTES,
	DEFAULT_API_LIFECYCLE,
} from '../../api';
import { CONFIG } from '../../constants';
import { getSortOrder } from '../../utils';
import { FlexContainer } from '../styles';

/*
TODO
- sort and keys question
- useEffect question
- context rerender
- ignore id in filter
- highlight matched item in UI
*/

const DEFAULT_FILTER_TEXT = undefined;
const DEFAULT_SORT_PARAMS = {
	index: undefined,
	order: undefined,
};
const DEFAULT_ROWS = [];
const EXECUTE_ON_MOUNT = true;

function filterRows(rows, filterText) {
	if (!filterText) {
		return rows;
	}
	if (!rows) {
		return rows;
	}

	return rows.filter((row, index) => {
		const rowColumns = Object.values(row).filter((col) =>
			col.includes(filterText)
		);
		// console.log(index, rowColumns);
		if (!rowColumns || rowColumns.length === 0) {
			return false;
		}
		return true;
	});
}

const TableContext = createContext();
function TableProvider({ children }) {
	const [tableDetails, tableDispatch] = useReducer(
		(currentState, action) => {
			switch (action.type) {
				case 'filter':
					return {
						...currentState,
						filterText: action.payload,
						rows: filterRows(currentState.dataLifecycle.data, action.payload),
					};
				case 'sort':
					return {
						...currentState,
						sortParams: action.payload,
						// Add sorting here
					};
				case 'dataLifecycle':
					return {
						...currentState,
						filterText: DEFAULT_FILTER_TEXT,
						sortParams: DEFAULT_SORT_PARAMS,
						dataLifecycle: action.payload,
						rows: action.payload.data,
					};
				default:
					throw new Error(
						`Invalid action.type ${action.type} for table reducer`
					);
			}
		},
		{
			dataLifecycle: { ...DEFAULT_API_LIFECYCLE, loading: EXECUTE_ON_MOUNT },
			filterText: DEFAULT_FILTER_TEXT,
			sortParams: DEFAULT_SORT_PARAMS,
			rows: DEFAULT_ROWS,
		}
	);
	return (
		<TableContext.Provider value={[tableDetails, tableDispatch]}>
			{children}
		</TableContext.Provider>
	);
}

function TableFilter() {
	const [tableDetails, tableDispatch] = useContext(TableContext);

	return (
		<FlexContainer>
			<label>Filter</label>
			<input
				type="text"
				value={tableDetails.filterText ?? ''}
				onChange={(e) =>
					tableDispatch({ type: 'filter', payload: e.target.value })
				}
			/>
		</FlexContainer>
	);
}

function TableHeader() {
	const [tableDetails, tableDispatch] = useContext(TableContext);
	const { sortParams } = tableDetails;

	return (
		<thead>
			<tr>
				{PEOPLE_ATTRIBUTES.map((attribute, index) => {
					return (
						<th
							key={`header-${index}`}
							onClick={() =>
								tableDispatch({
									type: 'sort',
									payload: {
										index,
										order:
											sortParams.index === index
												? getSortOrder(sortParams.order)
												: getSortOrder(undefined),
									},
								})
							}
						>
							{attribute}
						</th>
					);
				})}
			</tr>
		</thead>
	);
}

function TableFooter({ refetch }) {
	const [tableDetails] = useContext(TableContext);
	const {
		dataLifecycle: { loading, error, data },
		rows,
		sortParams,
	} = tableDetails;
	// console.log('TableFooter: ', loading, error, data);
	return (
		<tfoot>
			<tr>
				<td>
					<button onClick={refetch} disabled={loading}>
						Next
					</button>
				</td>
				<td>{`Sort Params: ${JSON.stringify(sortParams)}`}</td>
				{!loading && <td>{`Fetched Items: ${error ? 0 : data.length}`}</td>}
				{!loading && !error && <td>{`Filtered Items: ${rows.length}`}</td>}
			</tr>
		</tfoot>
	);
}

function TableData() {
	const [tableDetails] = useContext(TableContext);
	const {
		dataLifecycle: { loading, error },
		rows,
	} = tableDetails;

	if (loading) {
		return (
			<tbody>
				<tr>
					<td>Loading...</td>
				</tr>
			</tbody>
		);
	}

	if (error) {
		return (
			<tbody>
				<tr>
					<td>{error}</td>
				</tr>
			</tbody>
		);
	}

	if (!rows || rows.length === 0) {
		return (
			<tbody>
				<tr>
					<td>Nothing to see here.</td>
				</tr>
			</tbody>
		);
	}

	return (
		<tbody>
			{rows.map((person, rowIndex) => {
				return (
					<tr key={`row-${rowIndex}`}>
						{PEOPLE_ATTRIBUTES.map((attribute, colIndex) => {
							return (
								<td key={`row-${rowIndex}-col-${colIndex}`}>
									{person[attribute]}
								</td>
							);
						})}
					</tr>
				);
			})}
		</tbody>
	);
}

function Table() {
	const [_, tableDispatch] = useContext(TableContext);
	const { refetch, loading, error, data } = useApi(
		{ asyncFunction: fetchPeople, executeOnMount: EXECUTE_ON_MOUNT },
		CONFIG.TABLE_DATA_LIMIT
	);

	// console.log('Table: ', loading, error, data);

	useEffect(
		() =>
			tableDispatch({
				type: 'dataLifecycle',
				payload: { loading, error, data },
			}),
		[loading, error, data, tableDispatch] // Why storing these in object causes infinite renders?
	);

	return (
		<table>
			<TableHeader />
			<TableData />
			<TableFooter refetch={refetch} />
		</table>
	);
}

function TableContainer() {
	return (
		<TableProvider>
			<TableFilter />
			<Table />
		</TableProvider>
	);
}

export default TableContainer;