import { useReducer, useRef, useState } from 'react';
import {
	Container,
	AutocompleteContainer,
	Input,
	Popper,
	Option,
} from './styles';

const optionsData = Array(10)
	.fill(undefined)
	.map((_, index) => ({ key: index, displayValue: `Result ${index}` }));

function autocompleteReducer(currentState, action) {
	switch (action.type) {
		case 'updateText':
			return {
				...currentState,
				text: action.payload,
			};
		case 'updateOption':
			return {
				option: {
					index: action.payload.index,
					key: action.payload.key,
					value: action.payload.displayValue,
				},
				text: action.payload.displayValue,
			};
		default:
			throw new Error(
				`Invalid action.type passed to autocompleteReducer: ${action.type}`
			);
	}
}

const calculateNewIndex = (keyCode, index, length) => {
	if (index === undefined) {
		return 0;
	}
	if (keyCode === 'ArrowDown') {
		return (index + 1) % length;
	}
	//Up Arrow
	return index === 0 ? length - 1 : index - 1;
};

// API integration, debouncing
// Caching
// Support multi-select (will need more generalisation)
// Make it generic enough
function Autocomplete() {
	const [value, dispatch] = useReducer(autocompleteReducer, {
		option: { index: undefined, key: undefined, displayValue: undefined },
		text: '',
	});

	const [showPopper, toggleShowPopper] = useState(false);

	const inputRef = useRef(null),
		popperRef = useRef(null);

	// Input handlers
	const inputChange = (e) => {
		dispatch({ type: 'updateText', payload: e.target.value });
		toggleShowPopper(e.target.value !== '');
	};
	const inputFocus = (e) => {
		toggleShowPopper(value.text !== '');
	};
	const inputKeyDown = (e) => {
		toggleShowPopper(true);
		if (e.code === 'Enter') {
			toggleShowPopper(false);
		}
		if (!['ArrowDown', 'ArrowUp'].includes(e.code)) {
			return;
		}
		const newIndex = calculateNewIndex(
			e.code,
			value.option.index,
			optionsData.length
		);
		dispatch({
			type: 'updateOption',
			payload: { index: newIndex, ...optionsData[newIndex] },
		});
		// TODO: Scroll not working when scrolled to already seen elements
		popperRef.current.children[newIndex].scrollIntoView({
			behavior: 'smooth',
			block: 'center',
		});
	};

	// Option handlers
	const optionClick = (index) => {
		dispatch({
			type: 'updateOption',
			payload: { index, ...optionsData[index] },
		});
		toggleShowPopper(false);
	};

	return (
		<Container>
			<AutocompleteContainer id="autocompleteContainer">
				<Input
					id="input"
					ref={inputRef}
					value={value.text}
					onChange={inputChange}
					onFocus={inputFocus}
					onKeyDown={inputKeyDown}
					onClick={inputFocus}
					onBlur={(e) => {
						e.stopPropagation();
						if (!popperRef.current.contains(e.relatedTarget)) {
							toggleShowPopper(false);
						}
					}}
				></Input>
				<Popper id="popper" ref={popperRef} show={showPopper}>
					{optionsData.map(({ key, displayValue }, index) => (
						<Option
							id={`option-${key}`}
							tabIndex="0"
							key={key}
							onClick={() => optionClick(index)}
							isSelected={value.option.key === key}
						>
							{displayValue}
						</Option>
					))}
				</Popper>
			</AutocompleteContainer>
		</Container>
	);
}

export { Autocomplete };
