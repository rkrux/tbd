import { useEffect, useReducer, useRef, useState } from 'react';
import useApi, { fetchPasswords } from '../../api';
import { CONFIG } from '../../constants';
import { throttle } from '../../utils';
import {
	Container,
	AutocompleteContainer,
	Input,
	Popper,
	Option,
	Loading,
	Error,
} from './styles';

const DEFAULT_TEXT_VALUE = '',
	DEFAULT_OPTION = {
		index: undefined,
		key: undefined,
		displayValue: undefined,
	};

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

function autocompleteReducer(currentState, action) {
	switch (action.type) {
		case 'updateText':
			return {
				option: DEFAULT_OPTION,
				text: action.payload,
			};
		case 'updateOption':
			return {
				option: {
					index: action.payload.index,
					key: action.payload.key,
					displayValue: action.payload.displayValue,
				},
				text: action.payload.displayValue,
			};
		default:
			throw new Error(
				`Invalid action.type passed to autocompleteReducer: ${action.type}`
			);
	}
}

function AutocompleteResults({
	loading,
	error,
	options,
	value,
	dispatch,
	toggleShowPopper, // TODO: Remove this
}) {
	if (loading) {
		return (
			<Loading id="options-loading" tabIndex="0">
				Loading matched passwords...
			</Loading>
		);
	}

	if (error) {
		return (
			<Error id="options-loading" tabIndex="0">
				{`Error in fetching passwords: ${error}. Keep searching!`}
			</Error>
		);
	}

	if (!options.length) {
		return <></>;
	}

	// Option handlers
	const getOptionClickHandler = (index) => {
		return () => {
			dispatch({
				type: 'updateOption',
				payload: { index, ...options[index] },
			});
			toggleShowPopper(false);
		};
	};

	return options.map(({ key, displayValue }, index) => (
		<Option
			id={`option-${key}`}
			tabIndex="0"
			key={key}
			onClick={getOptionClickHandler(index)}
			isSelected={value.option.key === key}
		>
			{displayValue}
		</Option>
	));
}

// Erroneous state
// Caching
// Support multi-select (will need more generalisation)
// Make it generic enough
function Autocomplete() {
	// Base states
	const [value, dispatch] = useReducer(autocompleteReducer, {
		option: DEFAULT_OPTION,
		text: DEFAULT_TEXT_VALUE,
	});
	const { refetch, loading, error, data } = useApi(
		{ asyncFunction: fetchPasswords, executeOnMount: false },
		CONFIG.AUTOCOMPLETE_OPTIONS_LIMIT,
		value.text
	);

	// Helper states
	const [options, setOptions] = useState([]);
	const [showPopper, toggleShowPopper] = useState(false); // TODO: Move this inside base state, attach to dispatch

	// Refs
	const popperRef = useRef(null);

	// Effects
	useEffect(() => {
		if (
			value.text !== DEFAULT_TEXT_VALUE &&
			value.text !== value.option.displayValue
		) {
			throttle(refetch, CONFIG.API_THROTTLE_MS)();
		}
	}, [value.text]);
	useEffect(() => {
		if (data) {
			setOptions(data);
		}
	}, [data]);

	// Input handlers
	const inputFocus = () => {
		toggleShowPopper(
			(value.option.displayValue ?? value.text) !== DEFAULT_TEXT_VALUE
		);
	};
	const inputChange = (e) => {
		dispatch({
			type: 'updateText',
			payload: value.option.displayValue
				? e.target.value.replace(value.option.displayValue, '')
				: e.target.value,
		});
		toggleShowPopper(e.target.value !== DEFAULT_TEXT_VALUE);
	};
	const inputKeyDown = (e) => {
		if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(e.code)) {
			return;
		}

		// To open popper again after selection
		toggleShowPopper(true);
		if (e.code === 'Enter') {
			toggleShowPopper(false);
			return;
		}

		if (options.length === 0) {
			// Nothing to move up or down
			return;
		}

		// Handle up/down arrow keys
		const newIndex = calculateNewIndex(
			e.code,
			value.option.index,
			options.length
		);
		dispatch({
			type: 'updateOption',
			payload: { index: newIndex, ...options[newIndex] },
		});

		// TODO: Scroll not working when scrolled to already seen elements
		popperRef.current.children[newIndex].scrollIntoView({
			behavior: 'smooth',
			block: 'center',
		});
	};

	return (
		<Container>
			<AutocompleteContainer id="autocompleteContainer">
				<Input
					id="input"
					value={value.option.displayValue ?? value.text}
					onChange={inputChange}
					onFocus={inputFocus}
					onKeyDown={inputKeyDown}
					onClick={inputFocus}
					onBlur={(e) => {
						e.stopPropagation();
						/**
						 * If input goes out of focus by clicking on any child inside the
						 * popper, then keep the popper open; otherwise close it.
						 */
						if (!popperRef.current.contains(e.relatedTarget)) {
							toggleShowPopper(false);
						}
					}}
				></Input>
				<Popper id="popper" ref={popperRef} show={showPopper}>
					<AutocompleteResults
						loading={loading}
						error={error}
						options={options}
						value={value}
						dispatch={dispatch}
						toggleShowPopper={toggleShowPopper}
					/>
				</Popper>
			</AutocompleteContainer>
		</Container>
	);
}

export { Autocomplete };
