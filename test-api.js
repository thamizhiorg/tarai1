// ESM syntax
import fetch from 'node-fetch';

const TURSO_API_URL = 'https://tar-tarframework.aws-eu-west-1.turso.io/v2/pipeline';
const TURSO_API_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDM1MDY1OTIsImlkIjoiYjI1ODNhYTctNTQwOS00OTAyLWIxMWUtMzBkZjk5N2Q0NjIzIiwicmlkIjoiZmEwOWEwOWUtMTk3YS00M2M0LThmMDUtOTlmZTk0ZDhiZThkIn0.sKQEQR4b34LIs6pVW791zI7havvVEoKk9jHk1AvrOvr6OntKqyLGv85ZjRdeX4naSChv_ggGIbHNJgzMYxcxAA';

async function testApi() {
  try {
    const response = await fetch(TURSO_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TURSO_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            type: 'execute',
            stmt: {
              sql: 'SELECT * FROM products'
            }
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error executing Turso query:', error);
  }
}

testApi();
