import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import useApi, { fetchPosts } from '../../api';
import { CONFIG } from '../../constants';

const THROTTLE_MS = 600;

const PostContainer = styled.div`
	position: relative;
`;

const Post = styled.div`
	height: 100px;
	margin: 1vmin;
	padding: 10px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	border: 2px solid cyan;
	border-radius: 8px;
`;

const TopButton = styled.button`
	position: fixed;
	bottom: 2vh;
	right: 2vw;
	visibility: ${(props) => (props.isVisible === true ? 'visible' : 'hidden')};
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
		<>
			<PostContainer id="posts" ref={postsRef}>
				{postsList.map((post) => (
					<Post key={`post-${post.id}`}>
						<span>{post.name}</span>
						<span>{post.content}</span>
						<span>{post.time.toString()}</span>
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
		</>
	);
}

export default Scrolling;
