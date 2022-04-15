import { useState } from 'react';
import Carousel from './components/carousel';
import ObserverManipulation from './components/observerManipulation';
import InfiniteScroll from './components/infiniteScroll';
import MapClustering from './components/mapClustering';
import { StyledHeader, AppContainer } from './App.styles';

const componentConfig = {
	carousel: <Carousel />,
	observerManipulation: <ObserverManipulation />,
	infiniteScroll: <InfiniteScroll />,
	mapClustering: <MapClustering />,
};

function App() {
	const [component, setComponent] = useState('carousel');

	return (
		<>
			<StyledHeader>
				<span onClick={() => setComponent('carousel')}>Carousel</span>
				<span onClick={() => setComponent('observerManipulation')}>
					Observer Manipulation
				</span>
				<span onClick={() => setComponent('infiniteScroll')}>
					Infinite Scroll
				</span>
				<span onClick={() => setComponent('mapClustering')}>
					Map Clustering
				</span>
			</StyledHeader>
			<AppContainer>
				<div>{componentConfig[component]}</div>
			</AppContainer>
		</>
	);
}

export default App;
