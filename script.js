// Variables globales
let currentPrices = {};
let menuStructure = {};

// Cargar precios desde JSON
async function loadPrices() {
    try {
        const response = await fetch('precios.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        currentPrices = data.menu_items;
        menuStructure = menuData; // Del archivo menu-data.js
        updateUI();
        
        // Actualizar estado
        document.getElementById('jsonStatus').innerHTML = 
            '<i class="fas fa-check-circle"></i> Precios actualizados correctamente';
            
    } catch (error) {
        console.error('Error cargando precios:', error);
        document.getElementById('jsonStatus').innerHTML = 
            `<i class="fas fa-exclamation-circle"></i> Error cargando precios: ${error.message}`;
        document.getElementById('jsonStatus').style.color = 'var(--primary-color)';
    }
}

// Actualizar la interfaz con los precios
function updateUI() {
    const menuContainer = document.getElementById('menuContainer');
    menuContainer.innerHTML = '';
    
    // Crear secciones del menú
    for (const [section, items] of Object.entries(currentPrices)) {
        if (items && items.length > 0) {
            const sectionElement = createMenuSection(section, items);
            menuContainer.appendChild(sectionElement);
        }
    }
    
    // Crear sección de extras
    createExtrasSection();
}

// Crear sección del menú
function createMenuSection(sectionKey, items) {
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'menu-section';
    
    // Título de la sección (traducir la clave a español)
    const sectionTitles = {
        'hamburguesas': 'HAMBURGUESAS ESPECIALES',
        'club_house': 'CLUB HOUSE',
        'pollo_broaster': 'POLLO A LA BROASTER',
        'papas': 'PAPAS',
        'bebidas': 'BEBIDAS'
    };
    
    const title = sectionTitles[sectionKey] || sectionKey.toUpperCase();
    
    sectionDiv.innerHTML = `
        <h2 class="section-title">
            <i class="fas fa-utensils"></i> ${title}
        </h2>
        <div class="menu-items" id="${sectionKey}Items"></div>
    `;
    
    const itemsContainer = sectionDiv.querySelector(`#${sectionKey}Items`);
    
    items.forEach(item => {
        const itemElement = createMenuItem(item);
        itemsContainer.appendChild(itemElement);
    });
    
    return sectionDiv;
}

// Crear item del menú
function createMenuItem(item) {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.id = item.id;
    
    div.innerHTML = `
        <div class="item-header">
            <h3 class="item-name">${item.nombre}</h3>
            <span class="price">$${item.precio.toFixed(2)}</span>
        </div>
        ${item.descripcion ? `<p class="item-description">${item.descripcion}</p>` : ''}
    `;
    
    return div;
}

// Crear sección de extras
function createExtrasSection() {
    const extrasItems = document.getElementById('extrasItems');
    extrasItems.innerHTML = '';
    
    const extrasData = menuStructure.extras || [];
    
    extrasData.forEach(extra => {
        const extraDiv = document.createElement('div');
        extraDiv.className = 'extra-item';
        
        extraDiv.innerHTML = `
            <span class="extra-name">${extra.nombre}</span>
            <span class="extra-price">$${extra.precio.toFixed(2)}</span>
        `;
        
        extrasItems.appendChild(extraDiv);
    });
}

// Simular actualización de precios
function simulatePriceUpdate() {
    const updateBtn = document.getElementById('updatePricesBtn');
    const jsonStatus = document.getElementById('jsonStatus');
    
    // Aplicar estado de carga
    updateBtn.classList.add('loading');
    updateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualizando...';
    jsonStatus.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Actualizando precios...';
    
    // Simular actualización después de 1.5 segundos
    setTimeout(() => {
        // Aumentar todos los precios un 5% (simulación)
        for (const section in currentPrices) {
            if (currentPrices[section]) {
                currentPrices[section].forEach(item => {
                    item.precio *= 1.05;
                });
            }
        }
        
        // Actualizar UI
        updateUI();
        
        // Restaurar botón
        updateBtn.classList.remove('loading');
        updateBtn.innerHTML = '<i class="fas fa-redo"></i> Simular Actualización';
        
        // Mostrar confirmación
        jsonStatus.innerHTML = '<i class="fas fa-check-circle"></i> ¡Precios actualizados! (+5%)';
        jsonStatus.style.color = 'var(--success-color)';
        
        // Animación de confirmación
        jsonStatus.classList.add('price-updating');
        setTimeout(() => {
            jsonStatus.classList.remove('price-updating');
        }, 1000);
        
    }, 1500);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Cargar precios iniciales
    loadPrices();
    
    // Configurar botón de actualización
    document.getElementById('updatePricesBtn').addEventListener('click', simulatePriceUpdate);
    
    // Cargar datos del menú si no están en el JSON
    if (!menuStructure || Object.keys(menuStructure).length === 0) {
        menuStructure = menuData || {};
    }
});
