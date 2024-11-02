// public/js/script.js
document.addEventListener('DOMContentLoaded', () => {
    const carItems = document.querySelectorAll('.car-item');
    carItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('expanded');
        });
    });
});