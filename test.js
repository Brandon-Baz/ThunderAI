
import fetch from 'node-fetch';

async function testAPI() {
    const url = 'http://localhost:3000/api/chatgpt';
    const validData = { prompt: 'Hello, AI!', actionType: 'default' };
    const invalidData = { prompt: 'Invalid', actionType: 'invalid' };
    const longPromptData = { prompt: 'a'.repeat(1001), actionType: 'default' };

    async function makeRequest(data, testName) {
        console.log(`\nTesting ${testName}:`);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            console.log('Status:', response.status);
            console.log('Response:', await response.json());
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    await makeRequest(validData, 'valid request');
    await makeRequest(invalidData, 'invalid request');
    await makeRequest(longPromptData, 'long prompt');
    await makeRequest({}, 'empty request body');

    // Simulate concurrent requests
    console.log('\nTesting concurrent requests:');
    await Promise.all([
        makeRequest(validData, 'concurrent 1'),
        makeRequest(validData, 'concurrent 2'),
        makeRequest(validData, 'concurrent 3')
    ]);
}

testAPI();
