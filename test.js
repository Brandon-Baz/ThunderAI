
import fetch from 'node-fetch';

async function testAPI() {
    const url = 'http://localhost:3000/api/chatgpt';
    const validData = { prompt: 'Hello, AI!', actionType: 'default' };
    const invalidData = { prompt: 'Invalid', actionType: 'invalid' };

    console.log('Testing valid request:');
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validData)
        });
        console.log('Status:', response.status);
        console.log('Response:', await response.json());
    } catch (error) {
        console.error('Error:', error.message);
    }

    console.log('\nTesting invalid request:');
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(invalidData)
        });
        console.log('Status:', response.status);
        console.log('Response:', await response.json());
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testAPI();
