import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';

function initLayers() {
    return {
        openedLayer: null,
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
function closeLayer(id) {
    return { type: 'CLOSE_LAYER', id: id };
}

function openLayer(id) {
    return { type: 'OPEN_LAYER', id: id };
}

function toggleLayer(id) {
    var state = store.getState();
    var layer = state.layers.filter( layer => layer.id === id)[0];
    
    return dispatch => {
        if (layer.opened) {
            dispatch(closeLayer(id));
            return;
        }
        
        if (state.openedLayer) {
            dispatch(closeLayer(state.openedLayer));
            state.openedLayer.el.addEventListener('tranistionend', function(e) {
                dispatch(openLayer(id));
                e.target.removeEventListener('transitionend');
            });
            return;
        }
        
        dispatch(openLayer(id));
  };
}

//Reducer
function reducer(state, action) {
    switch (action.type) {
        case 'CLOSE_LAYER':
            return Object.assign({}, state, {
                openedLayer: null,
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
                layers: state.layers.map(function(layer){
                    if (layer.id === action.id) {
                        layer.opened = true;
                    }
                    return layer;
                })
            });
        default:
            return state;
    }
}

//Store
let store = createStore(reducer, initLayers(), applyMiddleware(thunkMiddleware));

//Front end 
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
