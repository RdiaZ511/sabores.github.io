document.addEventListener('DOMContentLoaded', () => {
    // Función para cargar y mostrar el menú
    async function loadMenu() {
        const menuContainer = document.getElementById('menu-container');
        
        try {
            // 1. Cargar el archivo JSON
            const response = await fetch('./menu.json');
            if (!response.ok) {
                throw new Error(`Error al cargar el menú: ${response.statusText}`);
            }
            const data = await response.json();

            // 2. Actualizar el logo y la información de contacto
            document.getElementById('logo').textContent = data.logo_text;
            document.getElementById('footer-logo').textContent = data.logo_text;

            document.getElementById('tel-header').textContent = data.contacto.telefono;
            document.getElementById('tel-footer').textContent = `Teléfono: ${data.contacto.telefono}`;
            document.getElementById('direccion-footer').textContent = data.contacto.direccion;
            document.getElementById('instagram-footer').textContent = `Instagram: ${data.contacto.instagram}`;

            // 3. Generar el contenido del menú
            menuContainer.innerHTML = ''; // Limpiar el mensaje de "Cargando..."
            
            data.menu.forEach(seccion => {
                // Crear el contenedor de la sección
                const sectionDiv = document.createElement('div');
                sectionDiv.className = 'bg-white shadow-xl rounded-lg overflow-hidden p-6';

                // Título de la sección
                const sectionTitle = document.createElement('h2');
                sectionTitle.className = 'text-3xl font-extrabold text-center text-gray-800 mb-6 border-b-4 border-primary pb-2';
                sectionTitle.textContent = seccion.categoria;
                sectionDiv.appendChild(sectionTitle);

                // Contenedor de productos (Diseño responsivo con columnas)
                const productsGrid = document.createElement('div');
                productsGrid.className = 'grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6';

                seccion.productos.forEach(producto => {
                    // Crear el item del producto
                    const productItem = document.createElement('div');
                    productItem.className = 'flex flex-col space-y-1 border-l-4 border-primary pl-3 hover:bg-gray-50 p-2 rounded transition duration-300';
                    
                    // Nombre y Precio
                    const header = document.createElement('div');
                    header.className = 'flex justify-between items-start';
                    
                    const name = document.createElement('h3');
                    name.className = 'text-xl font-bold text-gray-900 leading-tight';
                    name.textContent = producto.nombre;
                    
                    const price = document.createElement('span');
                    price.className = 'text-2xl font-extrabold text-primary ml-4 flex-shrink-0';
                    price.textContent = `$${producto.precio}`;
                    
                    header.appendChild(name);
                    header.appendChild(price);
                    
                    productItem.appendChild(header);

                    // Descripción
                    if (producto.descripcion) {
                        const description = document.createElement('p');
                        description.className = 'text-sm text-gray-600 italic';
                        description.textContent = producto.descripcion;
                        productItem.appendChild(description);
                    }
                    
                    productsGrid.appendChild(productItem);
                });

                sectionDiv.appendChild(productsGrid);
                menuContainer.appendChild(sectionDiv);
            });

        } catch (error) {
            console.error('Error al procesar el menú:', error);
            menuContainer.innerHTML = `<div class="text-center text-red-500 p-8">
                <p class="text-xl font-bold">¡Error al cargar el menú!</p>
                <p>Verifica que el archivo 'menu.json' exista y tenga el formato correcto.</p>
            </div>`;
        }
    }

    loadMenu();
});
