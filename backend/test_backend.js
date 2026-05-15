
const http = require('http');

let token = null;
let testVehicleId = null;

const results = [];

function request(method, path, body = null, useAuth = false) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path,
            method,
            headers: { 'Content-Type': 'application/json' }
        };
        if (useAuth && token) options.headers['Authorization'] = `Bearer ${token}`;

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
                catch (e) { resolve({ status: res.statusCode, body: data }); }
            });
        });
        req.on('error', (e) => resolve({ status: 0, body: { error: e.message } }));
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

function log(label, status, expectedStatus, body) {
    const expected = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];
    const ok = expected.includes(status);
    const icon = ok ? '✅' : '❌';
    results.push({ label, status, expected, ok });
    console.log(`${icon} [${status}] ${label}`);
    if (!ok) {
        console.log(`   Expected status: ${expected.join(' or ')}`);
        console.log(`   Response: ${JSON.stringify(body).substring(0, 300)}`);
    }
}

async function runTests() {
    console.log('\n╔══════════════════════════════════════════╗');
    console.log('║   VEHICLE RENTAL BACKEND — FULL TEST    ║');
    console.log('╚══════════════════════════════════════════╝\n');

    let r;
    const testEmail = `testuser_${Date.now()}@test.com`;
    const loginEmail = `login_${Date.now()}@test.com`;
    const futureStart = '2027-08-01';
    const futureEnd   = '2027-08-05';

    // ── AUTH ROUTES ──────────────────────────────────────────
    console.log('── AUTH ──────────────────────────────────────────');

    r = await request('GET', '/api/health');
    log('Health Check', r.status, 200, r.body);

    r = await request('POST', '/api/auth/register', {
        name: 'Test User', email: testEmail, password: 'Test@1234', phone: '9876543210'
    });
    log('Register New User', r.status, 201, r.body);
    if (r.body.token) token = r.body.token;

    r = await request('POST', '/api/auth/register', {
        name: 'Dup', email: testEmail, password: 'Test@1234', phone: '9876543210'
    });
    log('Register Duplicate Email (expect 400)', r.status, 400, r.body);

    r = await request('POST', '/api/auth/register', {
        name: 'Login Test', email: loginEmail, password: 'Pass@123', phone: '1234567890'
    });
    log('Register Login-Test User', r.status, 201, r.body);

    r = await request('POST', '/api/auth/login', { email: loginEmail, password: 'Pass@123' });
    log('Login (correct password)', r.status, 200, r.body);
    if (r.body.token) token = r.body.token;

    r = await request('POST', '/api/auth/login', { email: loginEmail, password: 'WrongPass' });
    log('Login Wrong Password (expect 401)', r.status, 401, r.body);

    r = await request('POST', '/api/auth/login', { email: 'noemail@test.com', password: 'Any' });
    log('Login Non-existent User (expect 401)', r.status, 401, r.body);

    r = await request('POST', '/api/auth/login', {});
    log('Login Missing Fields (expect 400)', r.status, 400, r.body);

    r = await request('GET', '/api/auth/me', null, true);
    log('Get Profile (authenticated)', r.status, 200, r.body);

    r = await request('GET', '/api/auth/me', null, false);
    log('Get Profile No Token (expect 401)', r.status, 401, r.body);

    r = await request('PUT', '/api/auth/update-profile', { name: 'New Name', phone: '9999999999' }, true);
    log('Update Profile', r.status, 200, r.body);

    // ── VEHICLE ROUTES ───────────────────────────────────────
    console.log('\n── VEHICLES ──────────────────────────────────────');

    r = await request('GET', '/api/vehicles');
    log('Get All Vehicles', r.status, 200, r.body);
    if (r.body.vehicles?.length > 0) {
        testVehicleId = r.body.vehicles[0]._id;
        console.log(`   → Found ${r.body.vehicles.length} vehicles in DB`);
    } else {
        console.log('   ⚠️  No vehicles in DB — run: node seed.js');
    }

    r = await request('GET', '/api/vehicles?type=car');
    log('Get Vehicles Filter (type=car)', r.status, 200, r.body);
    if (r.body.vehicles) console.log(`   → ${r.body.vehicles.length} cars found`);

    r = await request('GET', '/api/vehicles?minPrice=500&maxPrice=2000');
    log('Get Vehicles Filter (price range)', r.status, 200, r.body);

    if (testVehicleId) {
        r = await request('GET', `/api/vehicles/${testVehicleId}`);
        log('Get Single Vehicle by ID', r.status, 200, r.body);
    }

    r = await request('GET', '/api/vehicles/invalid_id_abc');
    log('Get Vehicle Invalid ID (expect 400)', r.status, 400, r.body);

    r = await request('GET', '/api/vehicles/000000000000000000000000');
    log('Get Vehicle Non-existent ID (expect 404)', r.status, 404, r.body);

    if (testVehicleId) {
        r = await request('POST', `/api/vehicles/${testVehicleId}/check-availability`, {
            startDate: futureStart, endDate: futureEnd
        });
        log('Check Vehicle Availability', r.status, 200, r.body);
        if (r.body) console.log(`   → Available: ${r.body.available}`);
    }

    // ── BOOKING ROUTES ───────────────────────────────────────
    console.log('\n── BOOKINGS ──────────────────────────────────────');

    r = await request('GET', '/api/bookings/user', null, false);
    log('Get Bookings No Token (expect 401)', r.status, 401, r.body);

    r = await request('GET', '/api/bookings/user', null, true);
    log('Get My Bookings (authenticated)', r.status, 200, r.body);
    if (r.body.bookings) console.log(`   → ${r.body.bookings.length} bookings found`);

    if (testVehicleId) {
        // Past date — should be rejected
        r = await request('POST', '/api/bookings', {
            vehicle: testVehicleId,
            startDate: '2020-01-01', endDate: '2020-01-05',
            pickupLocation:  { address: 'A', city: 'Mumbai', state: 'MH', zipCode: '400001' },
            dropoffLocation: { address: 'A', city: 'Mumbai', state: 'MH', zipCode: '400001' }
        }, true);
        log('Create Booking Past Date (expect 400)', r.status, 400, r.body);

        // Future date — should succeed
        r = await request('POST', '/api/bookings', {
            vehicle: testVehicleId,
            startDate: futureStart, endDate: futureEnd,
            pickupLocation:  { address: '123 Main St', city: 'Mumbai', state: 'MH', zipCode: '400001' },
            dropoffLocation: { address: '123 Main St', city: 'Mumbai', state: 'MH', zipCode: '400001' }
        }, true);
        log('Create Booking Future Date (expect 201)', r.status, [201, 200], r.body);
        if (r.body.booking) console.log(`   → Booking ID: ${r.body.booking._id}`);
    }

    r = await request('POST', '/api/bookings', {}, false);
    log('Create Booking No Auth (expect 401)', r.status, 401, r.body);

    // ── SUMMARY ─────────────────────────────────────────────
    const passed = results.filter(r => r.ok).length;
    const failed = results.filter(r => !r.ok).length;

    console.log('\n╔══════════════════════════════════════════╗');
    console.log('║              TEST SUMMARY                ║');
    console.log('╚══════════════════════════════════════════╝');
    console.log(`✅ Passed : ${passed}`);
    console.log(`❌ Failed : ${failed}`);
    console.log(`📊 Total  : ${results.length}`);

    if (failed > 0) {
        console.log('\n--- Failed Tests ---');
        results.filter(r => !r.ok).forEach(r =>
            console.log(`  ❌ [Got ${r.status}, expected ${r.expected.join('/')}] ${r.label}`)
        );
    } else {
        console.log('\n🎉 All tests passed! Backend is fully operational.');
    }
    console.log('');
}

runTests().catch(console.error);
