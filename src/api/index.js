import { useCallback, useEffect, useReducer } from 'react';

const DEFAULT_API_LIFECYCLE = {
	loading: false,
	error: undefined,
	data: undefined,
};

function reducer(currentState, action) {
	switch (action.type) {
		case 'loading':
			return {
				...currentState,
				loading: true,
			};
		case 'success':
			return {
				...currentState,
				loading: false,
				data: action.payload,
			};
		case 'error':
			return {
				...currentState,
				loading: false,
				error: action.payload,
			};
		default:
			throw new Error(`Invalid action type ${action.type} for Api reducer`);
	}
}

function useApi({ asyncFunction, executeOnMount = true }, ...args) {
	const [state, dispatch] = useReducer(reducer, {
		...DEFAULT_API_LIFECYCLE,
		loading: executeOnMount,
	});

	const apiDispatcher = useCallback(
		async (dispatch, asyncFunction, ...args) => {
			try {
				dispatch({ type: 'loading' });
				const response = await asyncFunction(...args);
				dispatch({ type: 'success', payload: response });
			} catch (error) {
				dispatch({ type: 'error', payload: error });
			}
		},
		[]
	);

	useEffect(() => {
		if (executeOnMount) {
			apiDispatcher(dispatch, asyncFunction, ...args);
		}
	}, []);

	return {
		...state,
		refetch: () => apiDispatcher(dispatch, asyncFunction, ...args),
	};
}

export default useApi;
export { DEFAULT_API_LIFECYCLE };
export * from './people';
