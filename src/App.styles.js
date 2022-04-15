import styled from 'styled-components';

const StyledHeader = styled.header`
	margin: 2vmin;
	padding: 1vmin;
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	border: 0.2vmin solid green;
	border-radius: 1vmin;
	font-size: calc(8px + 1vmin);
	font-weight: 300;
	text-decoration: underline;
	cursor: pointer;
`;

const AppContainer = styled.div`
	margin: 2vmin;
	padding: 2vmin;
	min-height: 85vh;
	border: 0.2vmin solid red;
	border-radius: 2vmin;
`;

export { AppContainer, StyledHeader };
