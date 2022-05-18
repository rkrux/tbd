import styled from 'styled-components';

const StyledTd = styled.td`
	text-decoration: ${(props) => (props.containsFilter ? 'underline' : 'none')};
`;

const StyledTable = styled.table`
	/* spacing */
	table {
		table-layout: fixed;
		width: 100%;
		border-collapse: collapse;
		border: 1px solid purple;
	}

	thead th {
		padding-top: 1vw;
		cursor: pointer;
	}

	thead th:nth-child(1) {
		width: 12%;
	}
	thead th:nth-child(4) {
		width: 10%;
	}
	thead th:nth-child(5) {
		width: 10%;
	}
	thead th:nth-child(6) {
		width: 12%;
	}
	thead th:nth-child(9) {
		width: 15%;
	}
	thead th:nth-child(10) {
		width: 15%;
	}

	/* typography */
	tbody td {
		text-align: center;
		padding: 4px;
		font-size: 16px;
	}

	tfoot td {
		text-align: center;
		font-size: 14px;
		font-style: italic;
	}

	/* zebra striping */
	tbody tr:nth-child(odd) {
		background-color: goldenrod;
	}

	tbody tr:nth-child(even) {
		background-color: grey;
	}
`;

export { StyledTd, StyledTable };
