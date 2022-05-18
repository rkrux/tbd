import { throttle } from '../../utils';
import { CONFIG } from '../../constants';

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
	};

	useEffect(() => {
		window.addEventListener('scroll', throttle(evaluate, CONFIG.THROTTLE_MS));
		return () =>
			window.removeEventListener(
				'scroll',
				throttle(evaluate, CONFIG.THROTTLE_MS)
			);
	}, [elementRef.current]);

	return [isInside, setIsInside];
}

export { useInsideViewport };
