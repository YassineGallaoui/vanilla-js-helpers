import '../dist/styles/stats.min.css';

class Stats {
    constructor() {
        this.statsDiv = null;
        this.handleResize = this.handleResize.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.updateFPS = this.updateFPS.bind(this);
        this.handlePositionClick = this.handlePositionClick.bind(this);
        this.handleTooltip = this.handleTooltip.bind(this);
        
        // FPS tracking variables
        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fpsUpdateInterval = 500; // Update FPS every 500ms
        this.animationFrameId = null;
        
        // Performance tracking variables
        this.frameTimes = [];
        this.maxFrameTimeHistory = 60; // Keep last 60 frame times
        this.frameDrops = 0;
        this.animationFrameJitter = 0;
        this.lastFrameTime = performance.now(); // Track individual frame timing
    }

    /**
     * Get browser engine info
     */
    getBrowserEngine() {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome')) return 'Blink';
        if (ua.includes('Firefox')) return 'Gecko';
        if (ua.includes('Safari') && !ua.includes('Chrome')) return 'WebKit';
        if (ua.includes('Edge')) return 'EdgeHTML/Blink';
        return 'Unknown';
    }

    /**
     * Get GPU info (simplified)
     */
    getGPUInfo() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).split(' ')[0];
                }
                return 'WebGL Available';
            }
            return 'No WebGL';
        } catch (e) {
            return 'Unknown';
        }
    }

    /**
     * Get scroll info
     */
    getScrollInfo() {
        const scrollY = Math.round(window.scrollY);
        const pageHeight = document.body.scrollHeight;
        const windowHeight = window.innerHeight;
        const scrollPercent = pageHeight > windowHeight ? 
            Math.round((scrollY / (pageHeight - windowHeight)) * 100) : 0;
        
        return {
            position: scrollY,
            percent: scrollPercent,
            pageHeight: pageHeight
        };
    }

    /**
     * Get theme and accessibility info
     */
    getThemeInfo() {
        // Check multiple contrast preferences for better browser support
        const highContrast = window.matchMedia('(prefers-contrast: high)').matches;
        const moreContrast = window.matchMedia('(prefers-contrast: more)').matches;
        const contrastValue = highContrast || moreContrast ? 'High' : 'Normal';
        
        return {
            colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light',
            contrast: contrastValue,
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'true' : 'false'
        };
    }

    /**
     * Get device capabilities
     */
    getDeviceInfo() {
        return {
            touchPoints: navigator.maxTouchPoints > 0 ? `true (${navigator.maxTouchPoints})` : 'false',
            hover: window.matchMedia('(hover: hover)').matches ? 'true' : 'false',
            orientation: screen.orientation ? `${screen.orientation.angle}°` : 'Unknown'
        };
    }

    /**
     * Get rendering metrics
     */
    getRenderingInfo() {
        // Calculate animation frame jitter
        if (this.frameTimes.length >= 2) {
            const variations = this.frameTimes.slice(1).map((time, i) => 
                Math.abs(time - this.frameTimes[i]));
            this.animationFrameJitter = variations.length > 0 ? 
                Math.round(variations.reduce((a, b) => a + b, 0) / variations.length * 100) / 100 : 0;
        }

        return {
            frameDrops: this.frameDrops,
            fps: this.fps,
            animationFrameJitter: this.animationFrameJitter
        };
    }

    /**
     * Handle position button clicks
     */
    handlePositionClick(e) {
        if (e.target.classList.contains('stats-btn')) {
            const position = e.target.id.replace('pos-', '');
            this.setPosition(position);
        } else if (e.target.id === 'stats-close') {
            this.statsDiv.classList.remove('show');
        }
    }

    /**
     * Set the position of the stats box
     */
    setPosition(position) {
        if (!this.statsDiv) return;
        
        // Remove all position classes
        this.statsDiv.classList.remove('pos-tl', 'pos-tr', 'pos-bl', 'pos-br');
        
        // Add the new position class
        this.statsDiv.classList.add(`pos-${position}`);
        
        // Update active button state
        const buttons = this.statsDiv.querySelectorAll('.stats-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        
        const activeButton = this.statsDiv.querySelector(`#pos-${position}`);
        if (activeButton) activeButton.classList.add('active');
    }

    /**
     * Handle tooltip show/hide events
     */
    handleTooltip(e) {
        if (!e.target.classList.contains('info-icon')) return;
        
        if (e.type === 'mouseenter') {
            this.showTooltip(e.target);
        } else if (e.type === 'mouseleave') {
            this.hideTooltip();
        }
    }

    /**
     * Show tooltip
     */
    showTooltip(iconEl) {
        // Remove any existing tooltip
        this.hideTooltip();
        
        const tooltip = document.createElement('div');
        tooltip.className = 'stats-tooltip';
        tooltip.textContent = iconEl.dataset.tooltip;
        
        // Add tooltip to DOM to measure its width
        tooltip.style.visibility = 'hidden';
        document.body.appendChild(tooltip);
        
        // Position tooltip relative to icon
        const iconRect = iconEl.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        // Check if stats box is on the left side (has pos-tl or pos-bl class)
        const isOnLeftSide = this.statsDiv.classList.contains('pos-tl') || this.statsDiv.classList.contains('pos-bl');
        
        // Check if stats box is on the bottom (has pos-bl or pos-br class)
        const isOnBottom = this.statsDiv.classList.contains('pos-bl') || this.statsDiv.classList.contains('pos-br');
        
        let left, top;
        
        if (isOnLeftSide) {
            // Position tooltip to the left of the icon
            left = iconRect.left - tooltipRect.width - 5;
        } else {
            // Position tooltip to the right of the icon (default)
            left = iconRect.right + 5;
        }
        
        if (isOnBottom) {
            // Position tooltip above the icon
            top = iconRect.top - tooltipRect.height - 5;
        } else {
            // Position tooltip below the icon (default)
            top = iconRect.bottom + 5;
        }
        
        // Ensure tooltip doesn't go off screen
        if (left < 5) left = 5;
        if (left + tooltipRect.width > window.innerWidth - 5) {
            left = window.innerWidth - tooltipRect.width - 5;
        }
        
        tooltip.style.position = 'fixed';
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
        tooltip.style.visibility = 'visible';
        
        this.currentTooltip = tooltip;
    }

    /**
     * Hide tooltip
     */
    hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    }

    /**
     * Gets the current window information
     * @returns {string} HTML string with window dimensions, aspect ratio, and FPS
     */
    getCurrentInfo() {
        const scroll = this.getScrollInfo();
        const theme = this.getThemeInfo();
        const device = this.getDeviceInfo();
        const rendering = this.getRenderingInfo();
        
        return `
      <div class="stats-controls">
        <button id="pos-tl" class="stats-btn" title="Top Left">TL</button>
        <button id="pos-tr" class="stats-btn" title="Top Right">TR</button>
        <button id="pos-bl" class="stats-btn" title="Bottom Left">BL</button>
        <button id="pos-br" class="stats-btn" title="Bottom Right">BR</button>
        <button id="stats-close" class="stats-close-btn" title="Close Stats">×</button>
      </div>
      <div class="s-d">
        <div class="s-c">
          <div><strong>DISPLAY</strong></div>
          <div class="s-l">
            <div class="l-v">Screen: <span id="stat-screen">${screen.width}x${screen.height}</span></div>
            <span class="info-icon" data-tooltip="Physical display dimensions - your actual monitor/device screen size">ⓘ</span>
          </div>
          <div class="s-l">
            <div class="l-v">Viewport: <span id="stat-viewport">${document.documentElement.clientWidth}x${document.documentElement.clientHeight}</span></div>
            <span class="info-icon" data-tooltip="Browser content area - excludes address bar, bookmarks, scrollbars">ⓘ</span>
          </div>
          <div class="s-l">
            <div class="l-v">Available: <span id="stat-available">${screen.availWidth}x${screen.availHeight}</span></div>
            <span class="info-icon" data-tooltip="Screen space minus OS UI - area where applications can be positioned">ⓘ</span>
          </div>
          <div class="s-l">
            <div class="l-v">Aspect Ratio: <span id="stat-aspect">${(window.innerWidth / window.innerHeight).toFixed(2)}</span></div>
          </div>
          <div class="s-l">
            <div class="l-v">DPR: <span id="stat-dpr">${window.devicePixelRatio}</span></div>
            <span class="info-icon" data-tooltip="Device Pixel Ratio - how many physical pixels equal one CSS pixel. Higher values indicate high-DPI displays">ⓘ</span>
          </div>
        </div>
        
        <div class="s-c">
          <div><strong>RENDERING</strong></div>
          <div class="s-l">
            <div class="l-v">FPS: <span id="stat-fps">${rendering.fps}</span></div>
          </div>
          <div class="s-l">
            <div class="l-v">Frame Jitter: <span id="stat-jitter">${rendering.animationFrameJitter}ms</span></div>
            <span class="info-icon" data-tooltip="Animation frame timing variance. Lower values indicate smoother animations. Good: <2ms, Fair: 2-5ms, Poor: >5ms">ⓘ</span>
          </div>
          <div class="s-l">
            <div class="l-v">Frame Drops: <span id="stat-frame-drops">${rendering.frameDrops}</span></div>
            <span class="info-icon" data-tooltip="Number of dropped frames (>33ms) - fewer drops indicate better performance">ⓘ</span>
          </div>
        </div>
        
        <div class="s-c">
          <div><strong>SCROLL</strong></div>
          <div class="s-l">
            <div class="l-v">Position: <span id="stat-scroll-pos">${scroll.position}px</span> (<span id="stat-scroll-percent">${scroll.percent}%</span>)</div>
          </div>
          <div class="s-l">
            <div class="l-v">Page Height: <span id="stat-page-height">${scroll.pageHeight}px</span></div>
          </div>
        </div>
        
        <div class="s-c">
          <div><strong>THEME</strong></div>
          <div class="s-l">
            <div class="l-v">Color Scheme: <span id="stat-color-scheme">${theme.colorScheme}</span></div>
          </div>
          <div class="s-l">
            <div class="l-v">Contrast: <span id="stat-contrast">${theme.contrast}</span></div>
            <span class="info-icon" data-tooltip="User's system preference for contrast levels. High contrast improves text readability for accessibility">ⓘ</span>
          </div>
          <div class="s-l">
            <div class="l-v">Reduced Motion: <span id="stat-reduced-motion">${theme.reducedMotion}</span></div>
            <span class="info-icon" data-tooltip="User's preference to minimize animations and motion effects for accessibility or motion sensitivity">ⓘ</span>
          </div>
        </div>
        
        <div class="s-c">
          <div><strong>DEVICE</strong></div>
          <div class="s-l">
            <div class="l-v">Touch: <span id="stat-touch">${device.touchPoints}</span></div>
          </div>
          <div class="s-l">
            <div class="l-v">Hover: <span id="stat-hover">${device.hover}</span></div>
          </div>
          <div class="s-l">
            <div class="l-v">Orientation: <span id="stat-orientation">${device.orientation}</span></div>
          </div>
        </div>
        
        <div class="s-c">
          <div><strong>BROWSER</strong></div>
          <div class="s-l">
            <div class="l-v">Engine: <span id="stat-engine">${this.getBrowserEngine()}</span></div>
          </div>
          <div class="s-l">
            <div class="l-v">GPU: <span id="stat-gpu">${this.getGPUInfo()}</span></div>
          </div>
        </div>
      </div>
    `;
    }

    /**
     * Update only specific stat values without re-rendering the entire DOM
     */
    updateStatValues() {
        if (!this.statsDiv || !this.statsDiv.classList.contains('show')) return;

        // Update display stats
        const widthEl = this.statsDiv.querySelector('#stat-width');
        const heightEl = this.statsDiv.querySelector('#stat-height');
        const aspectEl = this.statsDiv.querySelector('#stat-aspect');
        const viewportEl = this.statsDiv.querySelector('#stat-viewport');

        if (widthEl) widthEl.textContent = window.innerWidth;
        if (heightEl) heightEl.textContent = window.innerHeight;
        if (aspectEl) aspectEl.textContent = (window.innerWidth / window.innerHeight).toFixed(2);
        if (viewportEl) viewportEl.textContent = `${document.documentElement.clientWidth}x${document.documentElement.clientHeight}`;

        // Update FPS
        const fpsEl = this.statsDiv.querySelector('#stat-fps');
        if (fpsEl) fpsEl.textContent = this.fps;

        // Update rendering stats
        const rendering = this.getRenderingInfo();
        const jitterEl = this.statsDiv.querySelector('#stat-jitter');
        const frameDropsEl = this.statsDiv.querySelector('#stat-frame-drops');

        if (frameDropsEl) frameDropsEl.textContent = rendering.frameDrops;
        if (jitterEl) jitterEl.textContent = `${rendering.animationFrameJitter}ms`;

        // Update scroll stats
        const scroll = this.getScrollInfo();
        const scrollPosEl = this.statsDiv.querySelector('#stat-scroll-pos');
        const scrollPercentEl = this.statsDiv.querySelector('#stat-scroll-percent');
        const pageHeightEl = this.statsDiv.querySelector('#stat-page-height');

        if (scrollPosEl) scrollPosEl.textContent = `${scroll.position}px`;
        if (scrollPercentEl) scrollPercentEl.textContent = `${scroll.percent}%`;
        if (pageHeightEl) pageHeightEl.textContent = `${scroll.pageHeight}px`;

        // Update theme info (in case user changes system theme)
        const theme = this.getThemeInfo();
        const colorSchemeEl = this.statsDiv.querySelector('#stat-color-scheme');
        const contrastEl = this.statsDiv.querySelector('#stat-contrast');
        const reducedMotionEl = this.statsDiv.querySelector('#stat-reduced-motion');

        if (colorSchemeEl) colorSchemeEl.textContent = theme.colorScheme;
        if (contrastEl) contrastEl.textContent = theme.contrast;
        if (reducedMotionEl) reducedMotionEl.textContent = theme.reducedMotion;

        // Update device orientation
        const device = this.getDeviceInfo();
        const orientationEl = this.statsDiv.querySelector('#stat-orientation');
        if (orientationEl) orientationEl.textContent = device.orientation;
    }

    /**
     * Handles window resize events
     */
    handleResize() {
        this.updateStatValues();
    }

    /**
     * Updates FPS calculation using requestAnimationFrame
     */
    updateFPS() {
        this.frameCount++;
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;

        // Track individual frame times for performance analysis
        const individualFrameTime = currentTime - this.lastFrameTime;
        this.frameTimes.push(individualFrameTime);
        if (this.frameTimes.length > this.maxFrameTimeHistory) {
            this.frameTimes.shift();
        }
        this.lastFrameTime = currentTime;

        // Detect frame drops (frames taking longer than 33ms for 30fps threshold)
        if (individualFrameTime > 33) {
            this.frameDrops++;
        }

        // Update FPS every fpsUpdateInterval milliseconds
        if (deltaTime >= this.fpsUpdateInterval) {
            this.fps = Math.round((this.frameCount * 1000) / deltaTime);
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            // Update the display if stats are visible
            if (this.statsDiv) {
                this.updateStatValues();
            }
        }

        // Continue the animation loop
        this.animationFrameId = requestAnimationFrame(this.updateFPS);
    }

    /**
     * Handles keyboard events for stats toggling
     * @param {KeyboardEvent} e - The keyboard event
     */
    handleKeyPress(e) {
        if (e.key.toLowerCase() === 's') {
            this.statsDiv.classList.toggle('show');
        }
    }

    /**
     * Initializes the stats functionality
     */
    init() {
        // Create stats div
        this.statsDiv = document.createElement('div');
        this.statsDiv.id = 'stats';
        this.statsDiv.className = 'stats';
        this.statsDiv.innerHTML = this.getCurrentInfo();

        // Insert as first child of body
        document.body.insertBefore(this.statsDiv, document.body.firstChild);

        // Add event listeners
        window.addEventListener('resize', this.handleResize);
        document.addEventListener('keydown', this.handleKeyPress);
        this.statsDiv.addEventListener('click', this.handlePositionClick);
        this.statsDiv.addEventListener('mouseenter', this.handleTooltip, true);
        this.statsDiv.addEventListener('mouseleave', this.handleTooltip, true);

        // Set default position to top-left and make button active
        this.setPosition('tl');

        // Start FPS tracking
        this.animationFrameId = requestAnimationFrame(this.updateFPS);

        // Return cleanup function
        return () => {
            window.removeEventListener('resize', this.handleResize);
            document.removeEventListener('keydown', this.handleKeyPress);
            if (this.statsDiv) {
                this.statsDiv.removeEventListener('click', this.handlePositionClick);
                this.statsDiv.removeEventListener('mouseenter', this.handleTooltip, true);
                this.statsDiv.removeEventListener('mouseleave', this.handleTooltip, true);
            }
            this.hideTooltip(); // Clean up any active tooltip
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
            }
            this.statsDiv.remove();
        };
    }
}

export const stats = new Stats();
