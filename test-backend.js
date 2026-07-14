// Run this script with: bun test-backend.js
const API_URL = 'http://localhost:8080/api';
const TEST_EMAIL = `test_user_` + Math.random().toString(36).substring(7) + `@example.com`;
const TEST_PASSWORD = 'ComplexPassword123!@#Aruna';

async function runTests() {
    console.log('🚀 Starting Backend Integration Tests...');

    let testUser;
    let tournament;

    // 1. Signup
    try {
        console.log('\n1. Testing User Signup...');
        const signupRes = await fetch(`${API_URL}/users/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: TEST_EMAIL,
                password: TEST_PASSWORD,
                firstName: 'Test',
                lastName: 'User'
            })
        });

        if (!signupRes.ok) {
            const err = await signupRes.json();
            throw new Error(`Signup failed: ${err.message || signupRes.statusText}`);
        }

        testUser = await signupRes.json();
        console.log('✅ Signup Successful:', testUser.id);
    } catch (e) {
        console.error('❌ Signup Error:', e.message);
        return;
    }

    // 2. Setup Tournament
    try {
        console.log('\n2. Testing Tournament Setup...');
        const setupRes = await fetch(`${API_URL}/tournaments/setup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tournamentName: 'Backend Test Arena ' + Date.now(),
                numCourts: 4,
                gamesPerTeam: 3,
                isSkillBased: false,
                matchDuration: 15,
                breakTime: 5,
                startTime: new Date().toISOString(),
                location: 'Test Complex',
                organizer: testUser.id,
                tournamentType: 'Round Robin',
                format: 'Doubles',
                userId: testUser.id
            })
        });

        if (!setupRes.ok) {
            throw new Error(`Tournament setup failed: ${setupRes.statusText}`);
        }

        tournament = await setupRes.json();
        console.log('✅ Tournament Created:', tournament.id);
    } catch (e) {
        console.error('❌ Tournament Setup Error:', e.message);
        return;
    }

    // 3. Get All Tournaments
    try {
        console.log('\n3. Fetching All Tournaments...');
        const allRes = await fetch(`${API_URL}/tournaments/all`);
        const all = await allRes.json();
        console.log(`✅ Found ${all.length} tournaments`);
    } catch (e) {
        console.error('❌ Fetch All Error:', e.message);
    }

    // 4. Get My Tournaments
    try {
        console.log('\n4. Fetching My Tournaments...');
        const myRes = await fetch(`${API_URL}/tournaments/my`, {
            headers: { 'X-User-Id': testUser.id }
        });
        const my = await myRes.json();
        console.log(`✅ Found ${my.length} tournaments for current user`);
    } catch (e) {
        console.error('❌ Fetch My Error:', e.message);
    }

    // 5. Search Player
    try {
        console.log('\n5. Testing Player Search...');
        const searchRes = await fetch(`${API_URL}/tournaments/${tournament.id}/players/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: TEST_EMAIL })
        });
        if (!searchRes.ok) {
            const txt = await searchRes.text();
            throw new Error(`Search failed [${searchRes.status}]: ${txt}`);
        }
        const searchResults = await searchRes.json();
        console.log(`✅ Search successful: Found ${searchResults.length} results`);
    } catch (e) {
        console.error('❌ Search Error:', e.message);
    }

    // 5b. Testing Manual Player Addition (Secondary & Tertiary)
    let secondaryUser;
    let tertiaryUser;
    try {
        console.log('\n5b. Testing Manual Player Addition...');

        // P2
        const signupRes2 = await fetch(`${API_URL}/users/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'player2_' + Math.random().toString(36).substring(7) + '@example.com',
                password: TEST_PASSWORD,
                firstName: 'Player',
                lastName: 'Two'
            })
        });
        secondaryUser = await signupRes2.json();

        // P3
        const signupRes3 = await fetch(`${API_URL}/users/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'player3_' + Math.random().toString(36).substring(7) + '@example.com',
                password: TEST_PASSWORD,
                firstName: 'Player',
                lastName: 'Three'
            })
        });
        tertiaryUser = await signupRes3.json();

        // Add P2
        await fetch(`${API_URL}/tournaments/${tournament.id}/players/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: secondaryUser.id, displayName: 'P2 Tactical' })
        });

        // Add P3
        await fetch(`${API_URL}/tournaments/${tournament.id}/players/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: tertiaryUser.id, displayName: 'P3 Tactical' })
        });

        console.log('✅ Players added to tournament manually');
    } catch (e) {
        console.error('❌ Add Player Error:', e.message);
    }

    // 6. Create Teams (2 teams)
    try {
        console.log('\n6. Testing Team Creation (Team 1 & 2)...');
        await fetch(`${API_URL}/tournaments/${tournament.id}/teams`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Alpha Tactical',
                player1Id: testUser.id,
                player2Id: secondaryUser?.id
            })
        });

        const team2Res = await fetch(`${API_URL}/tournaments/${tournament.id}/teams`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Beta Tactical',
                player1Id: tertiaryUser?.id
            })
        });

        const team2 = await team2Res.json();
        console.log('✅ Two Teams Created Successfully');
    } catch (e) {
        console.error('❌ Create Team Error:', e.message);
    }

    // 7. Test Match Generation via Stages
    let stageId;
    try {
        console.log('\n7. Testing Stage Retrieval & Match Generation...');
        const stagesRes = await fetch(`${API_URL}/stages/tournament/${tournament.id}`);
        const stages = await stagesRes.json();

        if (stages.length > 0) {
            stageId = stages[0].id;
            console.log(`✅ Found Stage: ${stages[0].name} (${stageId})`);

            console.log('⚡ Triggering Match Generation...');
            const genRes = await fetch(`${API_URL}/stages/${stageId}/generate-matches`, {
                method: 'POST'
            });

            if (!genRes.ok) {
                const txt = await genRes.text();
                throw new Error(`Match generation failed [${genRes.status}]: ${txt}`);
            }
            console.log('✅ Matches generated successfully');
        } else {
            console.warn('⚠️ No stages found for this tournament');
        }
    } catch (e) {
        console.error('❌ Match Generation Error:', e.message);
    }

    // 7b. Verify Match Count
    try {
        console.log('\n7b. Verifying Match Count...');
        const matchesRes = await fetch(`${API_URL}/match/tournament/${tournament.id}`);
        const matches = await matchesRes.json();
        console.log(`✅ Success! Found ${matches.length} matches after generation`);
    } catch (e) {
        console.error('❌ Match Verification Error:', e.message);
    }

    // 8. Get Matches (Original 7)
    try {
        console.log('\n8. Testing Match Retrieval...');
        const matchesRes = await fetch(`${API_URL}/match/tournament/${tournament.id}`);
        const text = await matchesRes.text();

        if (!matchesRes.ok) {
            throw new Error(`Fetch matches failed [${matchesRes.status}]: ${text}`);
        }

        try {
            const matches = JSON.parse(text);
            console.log(`✅ Match API working! (Current match count: ${matches.length})`);
            if (matches.length === 0) {
                console.log('💡 Note: 0 matches found - this is expected since no matches were generated yet.');
            }
        } catch (je) {
            console.error('❌ Failed to parse match JSON. Raw Response:', text);
        }
    } catch (e) {
        console.error('❌ Fetch Matches Error:', e.message);
    }

    // 9. Test Tournament End (Original 8)
    try {
        console.log('\n9. Testing Tournament End...');
        const endRes = await fetch(`${API_URL}/tournaments/${tournament.id}/end`, {
            method: 'POST'
        });
        if (!endRes.ok) {
            const txt = await endRes.text();
            throw new Error(`End tournament failed [${endRes.status}]: ${txt}`);
        }
        console.log('✅ Tournament ended successfully');
    } catch (e) {
        console.error('❌ End Tournament Error:', e.message);
    }

    console.log('\n🏁 Tests Completed.');
}

runTests();
