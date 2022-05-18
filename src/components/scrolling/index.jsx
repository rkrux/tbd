import { useEffect, useRef, useState } from 'react';
import {
	Container,
	TopButton,
	PostContainer,
	PostSummary,
	Post,
	SummaryHeader,
} from './styles';
import useApi, { fetchPosts } from '../../api';
import { CONFIG } from '../../constants';
import { throttle } from '../../utils';

const OBSERVER_OPTIONS = {
	root: null,
	rootMargin: '0px',
	threshold: 0,
};

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

		window.addEventListener(
			'scroll',
			throttle(handleScroll, CONFIG.THROTTLE_MS)
		);

		return () =>
			window.removeEventListener(
				'scroll',
				throttle(handleScroll, CONFIG.THROTTLE_MS)
			);
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

function useIntersectionObserver(elementRef, deps, callbackFn) {
	useEffect(() => {
		if (!elementRef.current) {
			console.error(
				`Invalid element passed to useIntersectionObserver: ${elementRef.current}`
			);
			return;
		}

		const observer = new IntersectionObserver((entries) => {
			entries.forEach(callbackFn);
		}, OBSERVER_OPTIONS);

		observer.observe(elementRef.current);
		return () => observer.disconnect();
	}, deps);
}

function Scrolling() {
	const toDate = useRef(Date.now());
	const { refetch, loading, error, data } = useApi(
		{ asyncFunction: fetchPosts, executeOnMount: true },
		CONFIG.POST_LIMIT,
		toDate.current
	);

	const postsRef = useRef();
	const [postsList, updatePostsList] = useState([]);

	const summaryRef = useRef(),
		[showSummaryHeader, toggleSummaryHeader] = useState(false);

	useIntersectionObserver(summaryRef, [], (entry) => {
		toggleSummaryHeader(!entry.isIntersecting);
	});

	useEffect(() => {
		if (data) {
			toDate.current = data.toDate;
			updatePostsList([...postsList, ...data.posts]);
		}
	}, [data]);

	useEffect(() => {
		if (postsList.length > 0) {
			const observer = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						refetch();
					}
				});
			}, OBSERVER_OPTIONS);
			observer.observe(postsRef.current.lastElementChild);
			return () => observer.disconnect();
		}
	}, [postsList]);

	return (
		<>
			{showSummaryHeader && (
				<SummaryHeader>{`Hi user, ${postsList.length} posts for you to read`}</SummaryHeader>
			)}
			<Container>
				<PostSummary
					ref={summaryRef}
				>{`${postsList.length} posts`}</PostSummary>
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
			</Container>
			<TopScroller />
		</>
	);
}

export default Scrolling;
