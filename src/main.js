import {createStore} from 'redux';

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
function toggleLayer(id) {
    return { type: 'TOGGLE_LAYER', id: id };
}

function closeLayer(id) {
    return { type: 'CLOSE_LAYER', id: id };
}

function openLayer(id) {
    return { type: 'OPEN_LAYER', id: id };
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

function clickHandler(id) {
    return function() {
        var openedLayer = store.getState().openedLayer;
    
        if (openedLayer && openedLayer !== id) {
            store.dispatch(closeLayer(openedLayer));
            setTimeout(function() {
                store.dispatch(openLayer(id));
            }, 500);
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
});
