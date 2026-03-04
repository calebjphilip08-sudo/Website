// Native Blog System with Authentication
(function() {
    'use strict';

    const BLOG_STORAGE_KEY = 'blog_posts';
    const AUTH_TOKEN_KEY = 'blog_auth_token';
    const ADMIN_PASSWORD = 'cjphilip2026'; // Change this to your secure password!

    // Blog API
    window.BlogAPI = {
        // Check if user is authenticated
        isAuthenticated() {
            const token = localStorage.getItem(AUTH_TOKEN_KEY);
            return !!token;
        },

        // Login with password (simple comparison - NOT production secure)
        login(password) {
            // Direct password comparison (NOT cryptographic - for demo only)
            if (password === ADMIN_PASSWORD) {
                const token = btoa(Date.now() + ':' + Math.random().toString(36));
                localStorage.setItem(AUTH_TOKEN_KEY, token);
                return { success: true, message: 'Logged in successfully' };
            }
            return { success: false, message: 'Invalid password' };
        },

        // Logout
        logout() {
            localStorage.removeItem(AUTH_TOKEN_KEY);
            return { success: true, message: 'Logged out' };
        },

        // Get all blog posts
        getPosts(category = null) {
            const posts = JSON.parse(localStorage.getItem(BLOG_STORAGE_KEY) || '[]');
            if (category) {
                return posts.filter(p => p.category === category);
            }
            return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        },

        // Get single post
        getPost(id) {
            const posts = this.getPosts();
            return posts.find(p => p.id === id);
        },

        // Create post (requires auth)
        createPost(data) {
            if (!this.isAuthenticated()) {
                return { success: false, message: 'Not authenticated' };
            }

            if (!data.title || !data.content) {
                return { success: false, message: 'Title and content required' };
            }

            const posts = JSON.parse(localStorage.getItem(BLOG_STORAGE_KEY) || '[]');
            const post = {
                id: Date.now().toString(),
                title: data.title,
                content: data.content,
                category: data.category || 'general',
                date: new Date().toISOString(),
                author: 'C.J Philip',
                featured: data.featured || false,
                image: data.image || null,
                excerpt: data.excerpt || data.content.substring(0, 150) + '...',
                tags: data.tags || []
            };

            posts.push(post);
            localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
            return { success: true, message: 'Post created', post };
        },

        // Update post (requires auth)
        updatePost(id, data) {
            if (!this.isAuthenticated()) {
                return { success: false, message: 'Not authenticated' };
            }

            const posts = JSON.parse(localStorage.getItem(BLOG_STORAGE_KEY) || '[]');
            const index = posts.findIndex(p => p.id === id);

            if (index === -1) {
                return { success: false, message: 'Post not found' };
            }

            posts[index] = { ...posts[index], ...data };
            localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
            return { success: true, message: 'Post updated', post: posts[index] };
        },

        // Delete post (requires auth)
        deletePost(id) {
            if (!this.isAuthenticated()) {
                return { success: false, message: 'Not authenticated' };
            }

            const posts = JSON.parse(localStorage.getItem(BLOG_STORAGE_KEY) || '[]');
            const filtered = posts.filter(p => p.id !== id);

            if (filtered.length === posts.length) {
                return { success: false, message: 'Post not found' };
            }

            localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(filtered));
            return { success: true, message: 'Post deleted' };
        },

        // Get featured posts
        getFeaturedPosts(limit = 3) {
            return this.getPosts()
                .filter(p => p.featured)
                .slice(0, limit);
        },

        // Get posts by category
        getCategories() {
            const posts = this.getPosts();
            const categories = new Set(posts.map(p => p.category));
            return Array.from(categories);
        },

        // Export posts as JSON (for backup)
        exportPosts() {
            if (!this.isAuthenticated()) {
                return { success: false, message: 'Not authenticated' };
            }
            const posts = this.getPosts();
            return { success: true, data: posts };
        },

        // Import posts from JSON (for restore)
        importPosts(jsonData) {
            if (!this.isAuthenticated()) {
                return { success: false, message: 'Not authenticated' };
            }

            try {
                const posts = JSON.parse(jsonData);
                if (!Array.isArray(posts)) {
                    return { success: false, message: 'Invalid format' };
                }
                localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
                return { success: true, message: 'Posts imported' };
            } catch (e) {
                return { success: false, message: 'Invalid JSON' };
            }
        }
    };

    // Initialize with sample posts if empty
    if (!localStorage.getItem(BLOG_STORAGE_KEY)) {
        const samplePosts = [
            {
                id: '1',
                title: 'Welcome to My Blog',
                content: 'This is a native blog system built into my website. I\'ll be sharing writing tips, video plans, and personal updates here.',
                category: 'general',
                date: new Date(Date.now() - 7*24*60*60*1000).toISOString(),
                author: 'C.J Philip',
                featured: true,
                image: null,
                excerpt: 'This is a native blog system built into my website.',
                tags: ['announcement', 'blog']
            }
        ];
        localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(samplePosts));
    }

    console.log('Blog system initialized');
})();
