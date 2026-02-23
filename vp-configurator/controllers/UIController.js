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
/**
 * UIController - Handles all user interactions and updates the 3D State
 */
class UIController {
    constructor(config, engineCallback) {
        this.config = config; // Your garmentConfig.json
        this.currentGender = 'Men';
        this.currentCategory = 'Top';
        this.engineCallback = engineCallback; // The function that loads the 3D model

        this.initListeners();
        this.render();
    }

    initListeners() {
        // Gender Toggle
        document.getElementById('btn-men').addEventListener('click', () => this.setGender('Men'));
        document.getElementById('btn-women').addEventListener('click', () => this.setGender('Women'));

        // Mannequin Visibility
        document.getElementById('mannequin-toggle').addEventListener('change', (e) => {
            window.toggleMannequin(e.target.checked);
        });
    }

    setGender(gender) {
        this.currentGender = gender;
        
        // UI Feedback
        document.getElementById('btn-men').classList.toggle('active', gender === 'Men');
        document.getElementById('btn-women').classList.toggle('active', gender === 'Women');

        // Logic: When gender changes, clear the mannequin and clothes
        window.switchBaseMannequin(gender); 
        this.render(); // Refresh thumbnails
    }

    showCategory(category) {
        this.currentCategory = category;
        this.render();
    }

    render() {
        const grid = document.getElementById('thumbnail-grid');
        grid.innerHTML = ''; // Clear current view

        const items = this.config[this.currentGender][this.currentCategory];

        if (items.length === 0) {
            grid.innerHTML = '<p class="empty-msg">No items available in this category.</p>';
            return;
        }

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'thumb-card';
            
            // Path: assets/Men/Top/Shirt_01.png
            const thumbPath = `./assets/${this.currentGender}/${this.currentCategory}/${item.thumb}`;
            
            card.innerHTML = `
                <img src="${thumbPath}" onerror="this.src='./assets/placeholder.png'">
                <span>${item.name}</span>
            `;

            card.onclick = () => {
                // Highlight active thumb
                document.querySelectorAll('.thumb-card').forEach(el => el.classList.remove('active'));
                card.classList.add('active');

                // Load 3D Model
                this.engineCallback(this.currentGender, this.currentCategory, item.file);
            };

            grid.appendChild(card);
        });
    }
}
