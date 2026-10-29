let allComponents = [];

const searchInput = document.getElementById('search-input');
const categorySelect = document.getElementById('category-select');
const showResults = document.getElementById('show-results');

async function loadDatabase() {
    try {
        const response = await fetch('database.json');
        let fullDatabase = await response.json();

        allComponents = [
            ...(fullDatabase.GPU || []).map(item => ({ ...item, category: 'GPU' })),
            ...(fullDatabase.CPU || []).map(item => ({ ...item, category: 'CPU' })),
            ...(fullDatabase.PSU || []).map(item => ({ ...item, category: 'PSU' })),
            ...(fullDatabase.MB || []).map(item => ({ ...item, category: 'Motherboard' })),
            ...(fullDatabase.RAM || []).map(item => ({ ...item, category: 'RAM' })),
            ...(fullDatabase.SSD || []).map(item => ({ ...item, category: 'SSD' })),
            ...(fullDatabase.Case || []).map(item => ({ ...item, category: 'Cases' })),
            ...(fullDatabase.Cooler || []).map(item => ({ ...item, category: 'Coolers' })),
            ...(fullDatabase.thermal_paste || []).map(item => ({ ...item, category: 'thermal_paste' })),
            ...(fullDatabase.fans || []).map(item => ({ ...item, category: 'fans' }))
        ];

        filterAndDisplay();

    } catch(error) {
        console.error('Error loading database:', error);
    }
}

function filterAndDisplay() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categorySelect.value;

    const filtered = allComponents.filter(comp => {
        const matchesSearch = comp.name.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === 'all' || comp.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });

    showResults.innerHTML = ''; 
    if (filtered.length === 0) {
        showResults.innerHTML = '<p>Keine passenden Komponenten gefunden.</p>';
        return;
    }

    const ul = document.createElement('ul');
    filtered.forEach(comp => {
        const li = document.createElement('li');
        li.textContent = `${comp.name} (${comp.category}) – ${comp.price || 'Preis auf Anfrage'}`;
        ul.appendChild(li);
    });
    showResults.appendChild(ul);
}

searchInput.addEventListener('input', filterAndDisplay);
categorySelect.addEventListener('change', filterAndDisplay);
document.getElementById('search-button').addEventListener('click', filterAndDisplay);

loadDatabase();