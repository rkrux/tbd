import styled from 'styled-components';

const Container = styled.div`
	position: relative;
`;

const TopButton = styled.button`
	position: fixed;
	bottom: 2vh;
	right: 2vw;
	visibility: ${(props) => (props.isVisible === true ? 'visible' : 'hidden')};
`;

const PostContainer = styled.div`
	position: relative;
`;

const PostSummary = styled.div`
	position: absolute;
	top: 2vh;
	right: 1vw;
	padding: 1vmin;
	border: 2px solid lemonchiffon;
	border-radius: 8px;
`;

const Post = styled.div`
	width: 900px;
	margin: 1vmin;
	padding: 10px;
	border: 2px solid cyan;
	border-radius: 8px;
`;

const SummaryHeader = styled.div`
	position: sticky;
	top: 0px;
	width: 100%;
	padding: 1vmin;
	background-color: palegreen;
	border: 2px solid beige;
	z-index: 1;
`;

export {
	Container,
	TopButton,
	PostContainer,
	PostSummary,
	Post,
	SummaryHeader,
};
