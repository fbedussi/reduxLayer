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

function closeLayer(id) {
    return { type: 'CLOSE_LAYER', id: id };
}

function openLayer(id) {
    return { type: 'OPEN_LAYER', id: id };
}

function enqueueLayerToOpen(id) {
    return { type: 'ENQUEUE_LAYER', id: id };
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
        case 'CLOSE_LAYER':
            return Object.assign({}, state, {
                openedLayer: null,
                animating: true,
                layers: state.layers.map(function(layer){
                    if (layer.id === action.id) {
                        layer.opened = false;
                    }
                    return layer;
                })
            });
        case 'OPEN_LAYER':
            return Object.assign({}, state, {
               openedLayer: action.id,
               nextLayerToOpen: null,
               animating: true,
               layers: state.layers.map(function(layer){
                    if (layer.id === action.id) {
                        layer.opened = true;
                    }
                    return layer;
                })
            });
        case 'TRANSITION_END':
            return Object.assign({}, state, {
               animating: false
            });
        case 'ENQUEUE_LAYER':
            return Object.assign({}, state, {
               nextLayerToOpen: action.id
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
  
    if (!state.animating && state.nextLayerToOpen) {
        store.dispatch(openLayer(store.nextLayerToOpen));
        return;
    }
    
    state.layers.forEach(function(layer) {
        (layer.opened) ? layer.el.classList.add('open') : layer.el.classList.remove('open');
    });
});

function dispatchToggleLayerId(id) {
    return function() {
        store.dispatch(toggleLayer(id));
    };
}

function dispatchClearAnimating() {
    store.dispatch({type: 'TRANSITION_END'});
}

function clickHandler(id) {
    return function() {
        var openedLayer = store.getState().openedLayer;
    
        if (openedLayer && openedLayer !== id) {
            store.dispatch(closeLayer(openedLayer));
            store.dispatch(enqueueLayerToOpen(id));
            return;
        }
        
        if (openedLayer && openedLayer === id) {
            store.dispatch(closeLayer(id));
            return;
        }
        
        store.dispatch(openLayer(id));
    };
}

store.getState().layers.forEach(function(layer) {
    //layer.opener.addEventListener('click', dispatchToggleLayerId(layer.id));
    layer.opener.addEventListener('click', clickHandler(layer.id));
    layer.el.addEventListener('transitionend', dispatchClearAnimating);
});
