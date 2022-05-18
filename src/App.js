import { useState } from 'react';
import Carousel from './components/carousel';
import InfiniteScroll from './components/infiniteScroll';
import Table from './components/table';
import { Autocomplete } from './components/autocomplete';
import { StyledHeader, AppContainer } from './App.styles';

const componentConfig = {
	carousel: <Carousel />,
	table: <Table />,
	scrolling: <InfiniteScroll />,
	autocomplete: <Autocomplete />,
};

function App() {
	const [component, setComponent] = useState('carousel');

	return (
		<>
			<StyledHeader>
				<span onClick={() => setComponent('carousel')}>Image Carousel</span>
				<span onClick={() => setComponent('table')}>
					Employee Table (Sort/Filter)
				</span>
				<span onClick={() => setComponent('scrolling')}>
					Infinite Posts Scroller
				</span>
				<span onClick={() => setComponent('autocomplete')}>
					Password Autocomplete
				</span>
			</StyledHeader>
			<AppContainer>{componentConfig[component]}</AppContainer>
		</>
	);
}

export default App;
