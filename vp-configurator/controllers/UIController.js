function renderThumbnails(gender, category) {
    const container = document.getElementById('thumbnail-grid');
    container.innerHTML = ''; // Clear existing

    const items = garmentConfig[gender][category];

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'thumb-card';
        div.innerHTML = `
            <img src="./assets/${gender}/${category}/${item.thumb}" alt="${item.name}">
            <span>${item.name}</span>
        `;
        div.onclick = () => equipGarment(gender, category, item.file);
        container.appendChild(div);
    });
}
