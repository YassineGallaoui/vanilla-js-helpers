import { AppState, resetTransitionState, updateState } from './appState.js';

export class Router {
    constructor() {
        this.transitionDuration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--transition-duration')) * 1000; // Convert seconds to ms
        this.isTransitioning = false;
    }

    init() {
        // Wrap existing body content in current-content div
        const bodyContent = document.body.innerHTML;
        const wrapper = document.createElement('div');
        wrapper.id = 'current-content';
        wrapper.className = 'page-container';
        document.body.innerHTML = '';
        wrapper.innerHTML = bodyContent;
        document.body.appendChild(wrapper);

        // Prevent default link behavior
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href]')) {
                e.preventDefault();
                const href = e.target.getAttribute('href');
                this.navigate(href);
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.loadPage(window.location.pathname);
        });

        // Load initial page
        this.loadPage(window.location.pathname);
    }

    async navigate(path) {
        if (AppState.is.transitioning) return;

        window.history.pushState({}, '', path);
        await this.loadPage(path);
    }

    async loadPage(path) {
        // Remove trailing slash and .html if present
        path = path.replace(/\/$/, '').replace(/\.html$/, '');
        if (path === '') path = '/index';

        try {
            // Update app state
            updateState({
                path: path,
                page: path.split('/').pop()
            });

            // Determine the correct file path for fetching
            let fetchPath;
            if (path === '/index') {
                fetchPath = '/index.html';
            } else if (path.startsWith('/')) {
                // Try production path first (files at root level)
                const prodPath = `${path}.html`;
                const devPath = `/src/html${path}.html`;
                
                // Check if we're in development mode (Vite dev server)
                const isDev = import.meta.env.DEV;
                fetchPath = isDev ? devPath : prodPath;
            } else {
                fetchPath = `${path}.html`;
            }

            // Fetch new page content
            const response = await fetch(fetchPath);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Create new content container
            const newContent = document.createElement('div');
            newContent.id = 'new-content';
            newContent.className = 'page-container';
            newContent.innerHTML = doc.querySelector('body').innerHTML;

            // Add new content to body
            document.body.appendChild(newContent);

            // Check if this is the initial page load (previous route is null)
            const isInitialLoad = AppState.route.previous.path === null;

            if (!isInitialLoad) {
                // Add transition classes only if not initial load
                const currentContent = document.getElementById('current-content');
                currentContent.classList.add('page-exit');
                newContent.classList.add('page-enter');

                // Wait for transitions to complete
                await this.wait(this.transitionDuration);

                // Remove old content
                currentContent.remove();
            } else {
                // For initial load, just remove the old content without transition
                const currentContent = document.getElementById('current-content');
                currentContent.remove();
            }

            // Update IDs and classes
            newContent.id = 'current-content';
            newContent.classList.remove('page-enter');
        } catch (error) {
            // Handle routing error by showing a fallback or redirecting to home
            window.location.href = '/';
        } finally {
            resetTransitionState();
        }
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms * 1.2));
    }
}

export const router = new Router(); 