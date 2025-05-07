document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    // Sample blog posts data (this would typically come from a database or JSON file)
    const blogPosts = [
        {
            title: 'Evolving My Website with Cursor AI',
            excerpt: "As someone who loves solving problems and driving efficiency, I'm always looking for ways to improve my workflow. Recently, I discovered Cursor AI, an intelligent code editor that promised to revolutionize how I work with code.",
            date: '2025-05-07',
            category: 'Technology',
            url: 'cursor-ai-website-evolution.html'
        },
        // {
        //     title: 'Coming Soon',
        //     excerpt: "I'm working on my first blog post. Stay tuned!",
        //     date: '2024-03-20',
        //     category: 'Personal',
        //     url: '#'
        // }
        // Add more blog posts here as they are created
    ];

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        if (searchTerm.length < 2) {
            searchResults.innerHTML = '';
            return;
        }

        const filteredPosts = blogPosts.filter(post => 
            post.title.toLowerCase().includes(searchTerm) || 
            post.excerpt.toLowerCase().includes(searchTerm)
        );

        displayResults(filteredPosts);
    });

    function displayResults(posts) {
        if (posts.length === 0) {
            searchResults.innerHTML = '<p>No results found</p>';
            return;
        }

        const resultsHTML = posts.map(post => `
            <article class="search-result">
                <header>
                    <h3><a href="${post.url}">${post.title}</a></h3>
                    <p class="post-meta">${post.date} in ${post.category}</p>
                </header>
                <p>${post.excerpt}</p>
            </article>
        `).join('');

        searchResults.innerHTML = resultsHTML;
    }
}); 