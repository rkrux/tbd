import { useState } from 'react';
import Carousel from './components/carousel';
import Scrolling from './components/scrolling';
import Table from './components/table';
import { Autocomplete } from './components/autocomplete';
import { StyledHeader, AppContainer } from './App.styles';

const componentConfig = {
	carousel: <Carousel />,
	table: <Table />,
	scrolling: <Scrolling />,
	autocomplete: <Autocomplete />,
};

function App() {
	const [component, setComponent] = useState('carousel');

	return (
		<>
			<StyledHeader>
				<span onClick={() => setComponent('carousel')}>Carousel</span>
				<span onClick={() => setComponent('table')}>Table (Sort/Filter)</span>
				<span onClick={() => setComponent('scrolling')}>Scrolling</span>
				<span onClick={() => setComponent('autocomplete')}>Autocomplete</span>
			</StyledHeader>
			<AppContainer>{componentConfig[component]}</AppContainer>
		</>
	);
}

export default App;
