document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    // Sample blog posts data (this would typically come from a database or JSON file)
    const blogPosts = [
        {
            title: 'Attending My First Toastmasters District Conference',
            excerpt: "This past weekend marked a significant milestone in my public speaking journey as I attended my first Toastmasters District Conference. The experience was nothing short of transformative, and I'm excited to share the insights and lessons I gained from this incredible event.",
            date: '2025-05-08',
            category: 'Professional, Communication, Toastmasters',
            url: 'toastmasters-district-conference.html'
        },
        {
            title: 'Evolving My Website with Cursor AI',
            excerpt: "As someone who loves solving problems and driving efficiency, I'm always looking for ways to improve my workflow. Recently, I discovered Cursor AI, an intelligent code editor that promised to revolutionize how I work with code.",
            date: '2025-05-07',
            category: 'Technology',
            url: 'cursor-ai-website-evolution.html'
        },
        {
            title: 'How You Can Use AI to Run a Survivor Fantasy Pool',
            excerpt: "I decided to commission a Survivor Fantasy pool, and I turned to AI to support this time consuming endeavour. Running a fantasy pool for Survivor can be incredibly fun, but it also comes with its fair share of administrative challenges.",
            date: '2025-05-12',
            category: 'Survivor, Fantasy, Artificial Intelligence, Technology',
            url: 'survivor-ai-fantasy-pool.html'
        },
        {
            title: 'How I Meal Prep For the Week',
            excerpt: "Meal prepping is my secret weapon for saving time, eating healthier, and reducing stress during the week. Here's how I plan, shop, and cook in advance to make my week smoother and more delicious.",
            date: '2025-05-13',
            category: 'Meal Prep, Lifestyle',
            url: 'how-i-meal-prep-for-the-week.html'
        },
        {
            title: 'I Signed Up for an Olympic Triathlon',
            excerpt: "After completing my first marathon earlier this year, I've decided to take on an even bigger challenge: an Olympic-distance triathlon. This decision represents a significant step up in my athletic journey, combining three disciplines I've been passionate about individually.",
            date: '2025-05-15',
            category: 'Triathlon, Fitness, Swimming, Biking, Running',
            url: 'i-signed-up-for-an-olympic-triathlon.html'
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