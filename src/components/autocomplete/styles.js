import styled from 'styled-components';

const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`;

const AutocompleteContainer = styled.div`
	padding: 8px;
	border: 2px solid palevioletred;
	width: 300px;
`;

const Input = styled.input`
	width: 100%;
`;

const Popper = styled.div`
	display: ${(props) => (props.show ? 'flex' : 'none')};
	flex-direction: column;
	border: 2px solid seashell;
	max-height: 250px;
	overflow: auto;
`;

const Option = styled.div`
	margin: 4px;
	padding: 4px;
	border: 2px solid yellowgreen;
	background-color: ${(props) => (props.isSelected ? 'lightblue' : '')};
	&:hover {
		background-color: lightblue;
	}
`;

const Loading = styled.div`
	margin: 4px;
	padding: 4px;
	color: mediumturquoise;
`;

const Error = styled.div`
	margin: 4px;
	padding: 4px;
	color: palevioletred;
`;

export {
	Container,
	AutocompleteContainer,
	Input,
	Popper,
	Option,
	Loading,
	Error,
};
