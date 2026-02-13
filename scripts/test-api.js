const BASE_URL = 'http://localhost:3000/api';

async function testAPI() {
    console.log('🚀 Iniciando pruebas de API...\n');

    // 1. GET Products
    console.log('--- TEST 1: GET /products ---');
    try {
        const res = await fetch(`${BASE_URL}/products`);
        const data = await res.json();
        console.log(`Status: ${res.status}`);
        console.log(`Productos encontrados: ${Array.isArray(data) ? data.length : 0}`);
        if (res.status !== 200) console.error('Error:', data);
    } catch (e) {
        console.error('Fallo al conectar:', e.message);
    }

    // 2. CREATE Product via API
    console.log('\n--- TEST 2: POST /products (Crear) ---');
    let newProductId = '';
    try {
        const payload = {
            name: 'Producto Test API ' + Date.now(),
            price: 50000,
            stock: 10,
            category_id: 'a1b2c3d4-0001-4000-8000-000000000001', // ID de Flores (seed)
            description: 'Creado desde script de prueba'
        };

        // Esto fallará con 401/500 si RLS bloquea y no hay auth.
        // Es el comportamiento esperado si la API protege escrituras.

        const res = await fetch(`${BASE_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        console.log(`Status: ${res.status}`);
        if (res.status === 201) {
            console.log('Producto creado ID:', data.id);
            newProductId = data.id;
        } else {
            console.error('Error creando (Esperado si RLS activo):', data);
        }
    } catch (e) {
        console.error('Fallo POST:', e.message);
    }
}

testAPI();
