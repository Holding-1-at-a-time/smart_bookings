/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 27/02/2025 - 07:55:04
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 27/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { jest } from '@jest/globals';
import '@testing-library/jest-dom'; // Optional: If you're using Testing Library

// Mock console errors and warnings to avoid cluttering test output
global.console.error = jest.fn();
global.console.warn = jest.fn();

// Mock localStorage (if used in your components)
const localStorageMock = (function () {
    let store: { [key: string]: string } = {};
    return {
        getItem(key: string) {
            return store[key] || null;
        },
        setItem(key: string, value: string) {
            store[key] = value.toString();
        },
        removeItem(key: string) {
            delete store[key];
        },
        clear() {
            store = {};
        },
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Suggestion 1: Mock sessionStorage
const sessionStorageMock = (function () {
    let store: { [key: string]: string } = {};
    return {
        getItem(key: string) {
            return store[key] || null;
        },
        setItem(key: string, value: string) {
            store[key] = value.toString();
        },
        removeItem(key: string) {
            delete store[key];
        },
        clear() {
            store = {};
        },
    };
})();

Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });
// Mock navigator user agent, language, and platform (e.g., for responsive design)
Object.defineProperty(window, 'navigator', {
    value: {
        userAgent: 'Mocked User Agent',
        language: 'en-US',
        platform: 'Mocked Platform',
    },
    configurable: true,
});

// Mock screen dimensions (e.g., for responsive design)
Object.defineProperty(window, 'screen', {
    value: {
        width: 1920,
        height: 1080,
        availWidth: 1920,
        availHeight: 1080,
    },
    configurable: true,
});

// Mock document and window objects (e.g., for cookies)
Object.defineProperty(document, 'cookie', {
    get() {
        return this._cookie || '';
    },
    set(value) {
        this._cookie = value;
    },
    configurable: true,
});

// Mock window.location and window.history (e.g., for routing)
Object.defineProperty(window, 'location', {
    value: {
        href: '',
        assign: jest.fn(),
        reload: jest.fn(),
        replace: jest.fn(),
    },
    writable: true,
});

Object.defineProperty(window, 'history', {
    value: {
        pushState: jest.fn(),
        replaceState: jest.fn(),
        go: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
    },
    writable: true,
});


Object.defineProperty(window, 'history', {
    value: {
        state: {},
        pushState(state: unknown, _title: string, url: string) {
            this.state = state;
            this.replaceState(state, _title, url);
        },
        replaceState(state: unknown, _title: string, url: string) {
            this.state = state;
            Object.defineProperty(window, 'location', {
                value: {
                    href: url,
                    assign: jest.fn(),
                    reload: jest.fn(),
                },
                writable: true,
            });
        },
        go(delta: any) {
            if (delta === -1) {
                Object.defineProperty(window, 'location', {
                    value: {
                        href: '',
                        assign: jest.fn(),
                        reload: jest.fn(),
                    },
                    writable: true,
                });
            }
        },
    },
});
