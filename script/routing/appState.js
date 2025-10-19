import '../dist/styles/router.min.css';

// Application state management
export const AppState = {
    route: {
        current: {
            path: null,
            page: null
        },
        previous: {
            path: null,
            page: null
        }
    },
    is: {
        loading: false,
        transitioning: false
    }
};

// Update state helper
export function updateState(newState) {
    // Store previous state
    AppState.route.previous = { ...AppState.route.current };

    // Update current state
    AppState.route.current = {
        ...AppState.route.current,
        ...newState
    };

    // Update transition state
    AppState.is.transitioning = true;
}

// Reset transition state
export function resetTransitionState() {
    AppState.is.transitioning = false;
}
