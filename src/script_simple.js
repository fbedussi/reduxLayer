import {createStore} from 'redux';

function initLayers() {
    return {
        openedLayer: null,
        nextLayerToOpen: null,
        animating: false,
        layers: ['menu', 'account', 'cart'].map(function(id) {
            return {
                id,
                el: document.querySelector('.' + id + 'Layer'),
                opener: document.querySelector('.' + id + 'Opener'),
                opened: false
            };
        })
    };
}

//Actions
function toggleLayer(id) {
    return { type: 'TOGGLE_LAYER', id: id };
}

//Reducer
function reducer(state, action) {
    switch (action.type) {
        case 'TOGGLE_LAYER':
            return Object.assign({}, state, {
                layers: state.layers.map(function(layer){
                    if (layer.id === action.id) {
                        layer.opened = !layer.opened;
                    } else {
                        layer.opened = false;
                    }
                    return layer;
                })
            });
        default:
            return state;
    }
}

//Store
let store = createStore(reducer, initLayers());

store.subscribe(function() {
    const state = store.getState();
    console.log(state);

    state.layers.forEach(function(layer) {
        (layer.opened) ? layer.el.classList.add('open') : layer.el.classList.remove('open');
    });
});

function dispatchToggleLayerId(id) {
    return function() {
        store.dispatch(toggleLayer(id));
    };
}

store.getState().layers.forEach(function(layer) {
    layer.opener.addEventListener('click', dispatchToggleLayerId(layer.id));
});
