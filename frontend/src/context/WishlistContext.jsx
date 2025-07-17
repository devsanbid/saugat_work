import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';
import { wishlistAPI } from '../utils/api';

const WishlistContext = createContext();

const wishlistReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            };

        case 'SET_WISHLIST':
            return {
                ...state,
                items: action.payload,
                loading: false
            };

        case 'ADD_TO_WISHLIST':
            const exists = state.items.find(item => item._id === action.payload._id);
            if (exists) return state;

            return {
                ...state,
                items: [...state.items, action.payload]
            };

        case 'REMOVE_FROM_WISHLIST':
            return {
                ...state,
                items: state.items.filter(item => item._id !== action.payload)
            };

        case 'CLEAR_WISHLIST':
            return { ...state, items: [] };

        case 'MOVE_TO_CART':
            return {
                ...state,
                items: state.items.filter(item => item._id !== action.payload)
            };

        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                loading: false
            };

        default:
            return state;
    }
};

const initialState = {
    items: [],
    loading: false,
    error: null
};

export const WishlistProvider = ({ children }) => {
    const [state, dispatch] = useReducer(wishlistReducer, initialState);

    // Load wishlist from backend on mount
    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const response = await wishlistAPI.getWishlist();
            if (response.success) {
                dispatch({ type: 'SET_WISHLIST', payload: response.wishlist.items || [] });
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            dispatch({ type: 'SET_ERROR', payload: error.message });
            // Fallback to empty wishlist if user is not authenticated
            dispatch({ type: 'SET_WISHLIST', payload: [] });
        }
    };

    const addToWishlist = async (product) => {
        try {
            const response = await wishlistAPI.addToWishlist({ productId: product._id });
            if (response.success) {
                dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
                toast.success(`${product.name} added to wishlist! ❤️`);
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            toast.error(error.message || 'Failed to add to wishlist');
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const item = state.items.find(item => item._id === productId);
            const response = await wishlistAPI.removeFromWishlist(productId);
            if (response.success) {
                dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
                if (item) {
                    toast.info(`${item.product?.name || 'Item'} removed from wishlist`);
                }
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            toast.error(error.message || 'Failed to remove from wishlist');
        }
    };

    const clearWishlist = async () => {
        try {
            const response = await wishlistAPI.clearWishlist();
            if (response.success) {
                dispatch({ type: 'CLEAR_WISHLIST' });
                toast.info('Wishlist cleared');
            }
        } catch (error) {
            console.error('Error clearing wishlist:', error);
            toast.error(error.message || 'Failed to clear wishlist');
        }
    };

    const moveToCart = async (productId) => {
        try {
            const item = state.items.find(item => item._id === productId);
            const response = await wishlistAPI.moveToCart({ productId });
            if (response.success) {
                dispatch({ type: 'MOVE_TO_CART', payload: productId });
                if (item) {
                    toast.success(`${item.product?.name || 'Item'} moved to cart`);
                }
            }
        } catch (error) {
            console.error('Error moving to cart:', error);
            toast.error(error.message || 'Failed to move to cart');
        }
    };

    const isInWishlist = (productId) => {
        return state.items.some(item => item.product?._id === productId || item._id === productId);
    };

    const getWishlistCount = () => {
        return state.items.length;
    };

    const value = {
        wishlistItems: state.items,
        loading: state.loading,
        error: state.error,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        moveToCart,
        isInWishlist,
        getWishlistCount,
        fetchWishlist
    };

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

export { WishlistContext };
