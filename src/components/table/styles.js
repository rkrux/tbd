import styled from 'styled-components';

const StyledTd = styled.td`
	text-decoration: ${(props) => (props.containsFilter ? 'underline' : 'none')};
`;

export { StyledTd };
