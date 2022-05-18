import styled from 'styled-components';
import { FlexContainer } from '../styles';

const BlockContainer = styled.div`
	display: block;
`;

const ScrollbarContainer = styled.div`
	margin-top: 2vmin;
	width: '100%';
	height: 12px;
	border: 0.2vmin solid limegreen;
	border-radius: 2vmin;
	position: relative;
`;

const Scrollbar = styled.div`
	background-color: brown;
	border-radius: 2vmin;
	position: absolute;
	height: 12px;
	width: ${(props) => props.width};
	left: ${(props) => props.left};
	transition: all 0.5s ease-in-out;
`;

const ImageContainer = styled(FlexContainer)`
	position: relative;
`;

const Image = styled(FlexContainer)`
	border: 0.2vmin solid purple;
	height: 50vh;
	width: 50vw;
	font-size: 2vmin;
	border-radius: 2vmin;
`;

const Button = styled.button`
	display: ${(props) => (props.showNav === true ? 'block' : 'none')};
`;

const LeftButton = styled(Button)`
	position: absolute;
	left: 8px;
`;

const RightButton = styled(Button)`
	position: absolute;
	right: 8px;
`;

export {
	BlockContainer,
	ScrollbarContainer,
	Scrollbar,
	ImageContainer,
	Image,
	LeftButton,
	RightButton,
};
