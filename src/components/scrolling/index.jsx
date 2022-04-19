import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import useApi, { fetchPosts } from '../../api';
import { CONFIG } from '../../constants';

const THROTTLE_MS = 600;

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

function throttle(callbackFn, timeout, ...args) {
	let previousTimeout = 0;
	return () => {
		clearTimeout(previousTimeout);
		previousTimeout = setTimeout(() => callbackFn(...args), timeout);
	};
}

function TopScroller() {
	const [showTopScroller, toggleShowTopScroller] = useState(false);

	useEffect(() => {
		function handleScroll() {
			if (window.scrollY > window.innerHeight) {
				toggleShowTopScroller(true);
			} else {
				toggleShowTopScroller(false);
			}
		}

		window.addEventListener('scroll', throttle(handleScroll, THROTTLE_MS));

		return () =>
			window.removeEventListener('scroll', throttle(handleScroll, THROTTLE_MS));
	}, []);

	return (
		<TopButton
			isVisible={showTopScroller}
			onClick={() => {
				window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
			}}
		>
			Scroll to top
		</TopButton>
	);
}

function useInsideViewport(elementRef) {
	const [isInside, setIsInside] = useState(false);

	const evaluate = () => {
		if (!elementRef.current) {
			setIsInside(false);
			return;
		}

		const bounds = elementRef.current.getBoundingClientRect();
		const newIsInside = bounds.bottom < window.innerHeight + 100; // Buffer of some pixels
		setIsInside(newIsInside);
		/*
		console.log(
			`useInsideViewport,`,
			elementRef.current,
			`${bounds.top}, ${bounds.bottom}, ${newIsInside}`
		);
		*/
	};

	useEffect(() => {
		window.addEventListener('scroll', throttle(evaluate, THROTTLE_MS));
		return () =>
			window.removeEventListener('scroll', throttle(evaluate, THROTTLE_MS));
	}, [elementRef.current]);

	return [isInside, setIsInside];
}

let toDate = Date.now();

function Scrolling() {
	const { refetch, loading, error, data } = useApi(
		{ asyncFunction: fetchPosts, executeOnMount: true },
		CONFIG.POST_LIMIT,
		toDate
	);

	const postsRef = useRef();
	const [isLastPostInViewport, toggleLastPostInViewport] =
		useInsideViewport(postsRef);
	const [postsList, updatePostsList] = useState([]);

	useEffect(() => {
		if (isLastPostInViewport) {
			refetch();
			toggleLastPostInViewport(false);
		}
	}, [isLastPostInViewport]);

	useEffect(() => {
		if (data) {
			toDate = data.toDate;
			updatePostsList([...postsList, ...data.posts]);
		}
	}, [data]);

	return (
		<Container>
			<PostSummary>{`${postsList.length} posts!`}</PostSummary>
			<PostContainer id="posts" ref={postsRef}>
				{postsList.map((post) => (
					<Post key={`post-${post.id}`}>
						<b>{post.name}</b>
						<p>{post.content}</p>
						<em>{post.time.toString()}</em>
					</Post>
				))}
			</PostContainer>
			{loading && <>Loading posts...</>}
			{error && (
				<span>
					Error in fetching posts: {error}
					<button onClick={refetch}>Refetch</button>
				</span>
			)}
			<TopScroller />
		</Container>
	);
}

export default Scrolling;
