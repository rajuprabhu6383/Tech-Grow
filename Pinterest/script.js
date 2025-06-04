const gallery = document.getElementById('gallery');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const loader = document.getElementById('loader');


// Unsplash API settings
//own Unsplash api key
const accessKey = 'uRm-60aA3HdEntFCm2cMCv4lgZOrhmcrg0djjKwRM_0'; 
const apiUrl = 'https://api.unsplash.com/photos';
let currentPage = 1;
const perPage = 20;
let searchTerm = '';

// Load images from Unsplash API
async function loadImages(page = 1) {
    toggleLoading(true);
    try {
        const response = await fetch(`${apiUrl}?client_id=${accessKey}&page=${page}&per_page=${perPage}&order_by=popular${searchTerm ? `&query=${searchTerm}` : ''}`);
        if (!response.ok) {
            throw new Error('Failed to fetch images');
        }
        const data = await response.json();
        renderImages(data);
        toggleLoading(false);
    } catch (error) {
        toggleLoading(false);
        console.error('Error loading images:', error);
        alert('Error loading images. Please try again later.');
    }
}

function renderImages(images) {
    gallery.innerHTML = ''; // Clear previous images
    images.forEach(image => {
        const item = document.createElement('div');
        item.className = 'photo-item';
        item.tabIndex = 0;
        item.setAttribute('aria-label', `Photo by ${image.user.name}`);

        const img = document.createElement('img');
        img.src = image.urls.small;
        img.alt = image.alt_description || `Unsplash image by ${image.user.name}`;
        img.description = image.alt_description || `${image.title.name}`;
        img.loading = 'lazy';
        item.appendChild(img);

        const info = document.createElement('div');
        info.className = 'photo-info';

        const photographer = document.createElement('a');
        photographer.href = image.user.links.html + '?utm_source=pinterest_clone&utm_medium=referral';
        photographer.target = '_blank';
        photographer.rel = 'noopener';
        photographer.textContent = image.user.name;

        const likes = document.createElement('span');
        likes.title = `${image.likes} likes`;
        likes.textContent = `❤️ ${image.likes}`;

        info.appendChild(photographer);
        info.appendChild(likes);
        item.appendChild(info);

        gallery.appendChild(item);
    });
}

function toggleLoading(isLoading) {
    if (isLoading) {
        loader.style.display = 'block';
        loadMoreBtn.disabled = true;
        loadMoreBtn.style.cursor = 'default';
    } else {
        loader.style.display = 'none';
        loadMoreBtn.disabled = false;
        loadMoreBtn.style.cursor = 'pointer';
    }
}

// Load initial images
loadImages(currentPage);

// Load more images on button click
loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    loadImages(currentPage);
});

// Search functionality
searchInput.addEventListener('input', (event) => {
    searchTerm = event.target.value.trim();
    currentPage = 1; // Reset to first page
    gallery.innerHTML = ''; // Clear previous images
    loadImages(currentPage); // Load images based on search
});

// Optional: Infinite scroll functionality
window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 400 && !loadMoreBtn.disabled) {
        loadMoreBtn.click();
    }
});
