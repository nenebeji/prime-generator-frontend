import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert, Spinner, Card, Row, Col, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://localhost:8080/primes';

const calculatorBackgroundStyle = {
  backgroundColor: '#333', // Dark grey background
  minHeight: '100vh',
  paddingTop: '20px'
};

function App() {
  const [limit, setLimit] = useState('');
  const [primes, setPrimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseDetails, setResponseDetails] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setPrimes([]);
    setResponseDetails(null);

    const numLimit = parseInt(limit, 10);
    if (isNaN(numLimit) || numLimit < 2) {
      setError('Please enter a valid number greater than 1.');
      setLoading(false);
      return;
    }

    try {
      // Send the request with only the 'num' parameter
      const requestURL = `${API_URL}/${numLimit}`;

      const response = await axios.get(requestURL);

      setPrimes(response.data.primes);
      setResponseDetails({
        initial: response.data.initial,
        count: response.data.primes.length
      });

    } catch (err) {
      setError('Failed to fetch prime numbers. Check backend connection, port (8080), and CORS settings.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
      // Use Container fluid for full width on all screen sizes
      <Container fluid style={calculatorBackgroundStyle}>
        <Row className="justify-content-center">
          {/* Card takes up full width on small screens, 8 columns on medium+ screens */}
          <Col xs={12} md={8} lg={6}>
            <Card className="shadow-lg p-3 mb-5 bg-white rounded">
              <Card.Header as="h1" className="bg-primary text-white text-center">Prime Number Generator</Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formLimit">
                    <Form.Label>**Enter Limit (N):**</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter a number > 1"
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                        min="2"
                        required
                        size="lg"
                    />
                  </Form.Group>

                  <Button variant="success" type="submit" disabled={loading} className="w-100">
                    {loading ? (
                        <>
                          <Spinner animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                          {' Generating...'}
                        </>
                    ) : (
                        'Generate Primes'
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {error && (
            <Row className="justify-content-center">
              <Col xs={12} md={8} lg={6}>
                <Alert variant="danger">{error}</Alert>
              </Col>
            </Row>
        )}

        {responseDetails && (
            <Row className="justify-content-center mt-4">
              <Col xs={12} md={8} lg={6}>
                <Card className="shadow-sm">
                  <Card.Header className="bg-light">
                    **Results** up to {responseDetails.initial}
                    <span className="float-end badge bg-info text-dark">
                  Total: {responseDetails.count}
                </span>
                  </Card.Header>
                  <Card.Body>
                    {/* Use ListGroup for structured output */}
                    <ListGroup horizontal="sm" className="flex-wrap justify-content-center" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {primes.length > 0 ? (
                          primes.map((prime) => (
                              <ListGroup.Item key={prime} className="m-1 p-2">
                                {prime}
                              </ListGroup.Item>
                          ))
                      ) : (
                          <ListGroup.Item>No primes found in the specified range.</ListGroup.Item>
                      )}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
        )}
      </Container>
  );
}

export default App;
