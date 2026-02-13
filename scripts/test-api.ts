// Native fetch is available in Node 18+

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
    } catch (e: any) {
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

        // NOTA: Esto fallará si RLS no permite insert anónimo y no estamos enviando auth headers.
        // El endpoint usa el cliente supabase anon, que podría estar restringido x RLS.
        // Para simplificar la prueba, asumimos que estamos probando la lógica endpoint.

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
            console.error('Error creando:', data);
        }
    } catch (e: any) {
        console.error('Fallo POST:', e.message);
    }

    // 3. UPDATE Stock
    if (newProductId) {
        console.log('\n--- TEST 3: POST /stock/update ---');
        try {
            const res = await fetch(`${BASE_URL}/stock/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: newProductId,
                    quantity: 5,
                    operation: 'add'
                })
            });
            const data = await res.json();
            console.log(`Status: ${res.status}`);
            console.log('Resultado stock:', data);
        } catch (e: any) {
            console.error('Fallo Stock Update:', e);
        }

        // 4. DELETE Product
        console.log('\n--- TEST 4: DELETE /products ---');
        try {
            const res = await fetch(`${BASE_URL}/products?id=${newProductId}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            console.log(`Status: ${res.status}`);
            console.log('Resultado delete:', data);
        } catch (e: any) {
            console.error('Fallo Delete:', e);
        }
    }
}

testAPI();
