import { useState } from 'react';
import Carousel from './components/carousel';
import ObserverManipulation from './components/observerManipulation';
import InfiniteScroll from './components/infiniteScroll';
import MapClustering from './components/mapClustering';
import Table from './components/table';
import { StyledHeader, AppContainer } from './App.styles';

const componentConfig = {
	carousel: <Carousel />,
	table: <Table />,
	observerManipulation: <ObserverManipulation />,
	infiniteScroll: <InfiniteScroll />,
	autocomplete: <></>,
	mapClustering: <MapClustering />,
};

function App() {
	const [component, setComponent] = useState('table');

	return (
		<>
			<StyledHeader>
				<span onClick={() => setComponent('carousel')}>Carousel</span>
				<span onClick={() => setComponent('table')}>Table (Sort/Filter)</span>
				<span onClick={() => setComponent('observerManipulation')}>
					Observer Manipulation
				</span>
				<span onClick={() => setComponent('infiniteScroll')}>
					Infinite Scroll
				</span>
				<span onClick={() => setComponent('autocomplete')}>Autocomplete</span>
				<span onClick={() => setComponent('mapClustering')}>
					Map Clustering
				</span>
			</StyledHeader>
			<AppContainer>{componentConfig[component]}</AppContainer>
		</>
	);
}

export default App;
