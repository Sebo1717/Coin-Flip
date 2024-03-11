window.addEventListener('DOMContentLoaded', init);

function init() {
    // Initialize the CoinFlipManager when the DOM content is loaded
    new CoinFlipManager();
}

function CoinFlipManager() {
    // CSS class names for styling
    const DEFAULT_COLOR = 'text-white';
    const DEFAULT_COLOR_BORDER = 'dark:border-gray-700';
    const SELECTED_COLOR = 'text-blue-600';
    const SELECTED_COLOR_DARK = 'dark:text-blue-500';
    const SELECTED_COLOR_BORDER = 'border-blue-500';

    // DOM elements for the coin and buttons
    const coinHeadImage = document.getElementById('coin-head-image');
    const coinHeadText = document.getElementById('coin-head-text');
    const coinTailsImage = document.getElementById('coin-tails-image');
    const coinTailsText = document.getElementById('coin-tails-text');
    const coinFlipButton = document.getElementById('flip-coin-button');
    const clearButton = document.getElementById('clear-button');

    // Templates for history display
    const historyHeadTemplate = document.getElementById('history-head-template');
    const historyTailsTemplate = document.getElementById('history-tails-template');

    // Initialize the CoinFlipManager
    function init() {
        // Hide the history templates initially
        deactivateTemplates();
        // Update the UI based on the initial state
        updateUI();
    }

    // Create a store using the provided reducer and initial state
    const store = createStore({ history: [] }, reducer);

    // Function to create a simple Redux-like store
    function createStore(initialState, reducer) {
        // Use a Proxy to observe changes to the state
        const state = new Proxy(
            { value: initialState },
            {
                set(obj, prop, value) {
                    obj[prop] = value;
                    // Update the UI whenever the state changes
                    updateUI();
                },
            },
        );

        // Get the current state
        function getState() {
            return { ...state.value };
        }

        // Dispatch an action to update the state
        function dispatch(action, data) {
            const prevState = getState();
            state.value = reducer(prevState, action, data);
        }

        return {
            getState,
            dispatch,
        };
    }

    // Reducer function to handle state updates based on actions
    function reducer(state, action, data) {
        switch (action) {
            case 'COIN_FLIP':
                // Update state for coin flip action
                state = {
                    selectedCoin: data,
                    history:
                        state.history.length > 4
                            ? [...state.history.splice(-4), data]
                            : [...state.history, data],
                };
                break;
            case 'CLEAR':
                // Update state for clear action
                state = {
                    selectedCoin: null,
                    history: [],
                };
                break;
        }
        return state;
    }

    // Update the UI based on the current state
    function updateUI() {
        const { history } = store.getState();

        if (history.length <= 0) {
            // If there's no history, unselect the coin and clear the history display
            unselectCoin();
            clearHistory();
            return;
        }

        // Update the selected coin and history display
        updateSelectedCoin(history[history.length - 1]);
        updateHistory(history);
    }

    // Update the selected coin based on the coin flip result
    function updateSelectedCoin(selectedCoin) {
        // First, unselect any previously selected coin
        unselectCoin();
        // Then, select the new coin based on the result
        selectCoin(selectedCoin);
    }

    // Update the history display based on the array of coin flip results
    function updateHistory(history) {
        // Clear the existing history display
        clearHistory();
        // Set up the new history display based on the provided history array
        setHistory(history);
    }

    // Function to create and display history elements based on the array of results
    function setHistory(history) {
        history.forEach((coin) => {
            // Clone the appropriate template based on the coin result
            const newCoin =
                coin === 'HEAD' ? historyHeadTemplate.cloneNode(true) : historyTailsTemplate.cloneNode(true);
            // Set an ID for the new coin element
            newCoin.id = 'history-coin';
            // Make the new coin element visible
            newCoin.style.display = 'flex';
            // Append the new coin to the parent node
            historyHeadTemplate.parentNode.appendChild(newCoin);
        });
    }

    // Function to clear the history display by removing all history elements
    function clearHistory() {
        // Find all history elements with the specified ID
        const historyCoins = Array.from(document.querySelectorAll('#history-coin'));
        // Remove each history element
        historyCoins.forEach((coin) => coin.remove());
    }

    // Function to select and highlight the coin based on the result
    function selectCoin(selectedCoin) {
        // Determine the DOM elements for the selected coin
        const selectedCoinImage = selectedCoin === 'HEAD' ? coinHeadImage : coinTailsImage;
        const selectedCoinText = selectedCoin === 'HEAD' ? coinHeadText : coinTailsText;

        // Remove default styles and apply selected styles
        selectedCoinImage.classList.remove(DEFAULT_COLOR);
        selectedCoinText.classList.remove(DEFAULT_COLOR);
        selectedCoinImage.parentElement.classList.remove(DEFAULT_COLOR_BORDER);
        selectedCoinImage.classList.add(SELECTED_COLOR, SELECTED_COLOR_DARK);
        selectedCoinText.classList.add(SELECTED_COLOR, SELECTED_COLOR_DARK);
        selectedCoinImage.parentElement.classList.add(SELECTED_COLOR_BORDER);
    }

    // Function to simulate a coin flip and dispatch the result to the store
    function flipCoin() {
        return Math.random() < 0.5 ? 'HEAD' : 'TAILS';
    }

    // Event handler for the coin flip button
    function handleCoinFlip(e) {
        e.preventDefault();
        // Remove focus from the button
        e.target.blur();

        // Simulate a coin flip and dispatch the result
        const coinFlipResult = flipCoin();
        store.dispatch('COIN_FLIP', coinFlipResult);
    }

    // Event handler for the clear button
    function handleClear(e) {
        e.preventDefault();
        // Remove focus from the button
        e.target.blur();

        // Dispatch a clear action to reset the state
        store.dispatch('CLEAR');
    }

    // Function to unselect the coin by removing its highlighting
    function unselectCoin() {
        // Remove selected styles and apply default styles
        coinHeadImage.classList.remove(SELECTED_COLOR, SELECTED_COLOR_DARK);
        coinHeadImage.classList.add(DEFAULT_COLOR);
        coinHeadText.classList.remove(SELECTED_COLOR, SELECTED_COLOR_DARK);
        coinHeadText.classList.add(DEFAULT_COLOR);
        coinHeadImage.parentElement.classList.remove(SELECTED_COLOR_BORDER);
        coinHeadImage.parentElement.classList.add(DEFAULT_COLOR_BORDER);

        coinTailsImage.classList.remove(SELECTED_COLOR, SELECTED_COLOR_DARK);
        coinTailsImage.classList.add(DEFAULT_COLOR);
        coinTailsText.classList.remove(SELECTED_COLOR, SELECTED_COLOR_DARK);
        coinTailsText.classList.add(DEFAULT_COLOR);
        coinTailsText.parentElement.classList.remove(SELECTED_COLOR_BORDER);
        coinTailsText.parentElement.classList.add(DEFAULT_COLOR_BORDER);
    }

    // Function to hide the history templates initially
    function deactivateTemplates() {
        historyHeadTemplate.style.display = 'none';
        historyTailsTemplate.style.display = 'none';
    }

    // Event listeners for the coin flip and clear buttons
    coinFlipButton.addEventListener('click', handleCoinFlip);
    clearButton.addEventListener('click', handleClear);

    // Initialize the CoinFlipManager
    init();
}