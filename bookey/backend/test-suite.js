import app from "./server.js";

const PORT = 5001; // Test server port
let server;
const BASE_URL = `http://localhost:${PORT}`;

async function runTests() {
  console.log("============================================================");
  console.log("STARTING AUTOMATED API TEST SUITE FOR TD-TP 3 (ENSTA 2026)");
  console.log("============================================================\n");

  server = app.listen(PORT, async () => {
    let passed = 0;
    let failed = 0;

    const assert = (condition, testName, details = "") => {
      if (condition) {
        console.log(`PASS: ${testName}`);
        passed++;
      } else {
        console.error(`FAIL: ${testName} - ${details}`);
        failed++;
      }
    };

    let authToken = "";
    let testProductId = "";

    try {
      // 1. Health check
      const resHealth = await fetch(`${BASE_URL}/`);
      assert(resHealth.status === 200, "1. Health check returns 200 OK");

      // 2. Register a new user (201 Created)
      const resReg = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test Student",
          email: "student.test@ensta.dz",
          password: "password123"
        })
      });
      const dataReg = await resReg.json();
      assert(resReg.status === 201 && dataReg.success === true, "2. Register new user returns 201 Created");

      // 3. Register duplicate email (409 Conflict)
      const resDup = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Duplicate User",
          email: "student.test@ensta.dz",
          password: "password999"
        })
      });
      assert(resDup.status === 409, "3. Register duplicate email returns 409 Conflict");

      // 4. Register missing fields (400 Bad Request)
      const resMissing = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "incomplete@ensta.dz" })
      });
      assert(resMissing.status === 400, "4. Register missing fields returns 400 Bad Request");

      // 5. Login with invalid password (401 Unauthorized)
      const resBadLogin = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "student.test@ensta.dz",
          password: "wrongpassword"
        })
      });
      assert(resBadLogin.status === 401, "5. Login with invalid credentials returns 401 Unauthorized");

      // 6. Login with valid credentials (200 OK + JWT)
      const resLogin = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "student.test@ensta.dz",
          password: "password123"
        })
      });
      const dataLogin = await resLogin.json();
      authToken = dataLogin.token;
      assert(
        resLogin.status === 200 && authToken && typeof authToken === "string",
        "6. Login with valid credentials returns 200 OK and signed JWT token"
      );

      // 7. Get All Products (Public - 200 OK)
      const resProducts = await fetch(`${BASE_URL}/api/products`);
      const dataProducts = await resProducts.json();
      assert(
        resProducts.status === 200 && Array.isArray(dataProducts.products),
        "7. Retrieve all products (Public) returns 200 OK and products array"
      );

      // 8. Create Product without token (401 Unauthorized)
      const resNoToken = await fetch(`${BASE_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Unauthorized Book",
          description: "Desc",
          price: 1000,
          category: "Novel"
        })
      });
      assert(resNoToken.status === 401, "8. Create product without token returns 401 Unauthorized");

      // 9. Create Product with invalid token (401 Unauthorized)
      const resFakeToken = await fetch(`${BASE_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer invalid_tampered_token"
        },
        body: JSON.stringify({
          name: "Invalid Token Book",
          description: "Desc",
          price: 1000,
          category: "Novel"
        })
      });
      assert(resFakeToken.status === 401, "9. Create product with invalid token returns 401 Unauthorized");

      // 10. Create Product with valid token (201 Created)
      const resCreate = await fetch(`${BASE_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          name: "La Colline Oubliée",
          description: "A foundational work set in a Berber village in Kabylia.",
          price: 1100,
          category: "Novel",
          imageUrl: "https://example.com/cover.jpg",
          stock: 15,
          author: "Mouloud Mammeri",
          year: 1952
        })
      });
      const dataCreate = await resCreate.json();
      testProductId = dataCreate.product ? dataCreate.product._id : null;
      assert(
        resCreate.status === 201 && testProductId,
        "10. Create product with valid JWT returns 201 Created"
      );

      // 11. Get Single Product by ID (Public - 200 OK)
      const resGetOne = await fetch(`${BASE_URL}/api/products/${testProductId}`);
      const dataGetOne = await resGetOne.json();
      assert(
        resGetOne.status === 200 && dataGetOne.product.name === "La Colline Oubliée",
        "11. Retrieve product by ID returns 200 OK"
      );

      // 12. Invalid product ID format (400 Bad Request)
      const resBadId = await fetch(`${BASE_URL}/api/products/bad-id-string`);
      assert(resBadId.status === 400, "12. Malformed product ID returns 400 Bad Request");

      // 13. Non-existent product ID (404 Not Found)
      const resNotFound = await fetch(`${BASE_URL}/api/products/60d5ecb8b5c9c72e8c8b9999`);
      assert(resNotFound.status === 404, "13. Non-existent product ID returns 404 Not Found");

      // 14. Update Product with JWT (200 OK)
      const resUpdate = await fetch(`${BASE_URL}/api/products/${testProductId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          price: 1350,
          stock: 20
        })
      });
      const dataUpdate = await resUpdate.json();
      assert(
        resUpdate.status === 200 && dataUpdate.product.price === 1350,
        "14. Update product with valid JWT returns 200 OK"
      );

      // 15. Delete Product with JWT (200 OK)
      const resDelete = await fetch(`${BASE_URL}/api/products/${testProductId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      assert(resDelete.status === 200, "15. Delete product with valid JWT returns 200 OK");

      // 16. Verify Deleted Product returns 404
      const resAfterDel = await fetch(`${BASE_URL}/api/products/${testProductId}`);
      assert(resAfterDel.status === 404, "16. Verified product is removed (404 Not Found)");

      // 17. OAuth 2.0 Mock Token Endpoint (200 OK)
      const resOAuth = await fetch(`${BASE_URL}/api/auth/oauth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_id: "ensta_client" })
      });
      const dataOAuth = await resOAuth.json();
      assert(
        resOAuth.status === 200 && dataOAuth.access_token,
        "17. OAuth 2.0 Token endpoint returns 200 OK with Bearer access_token"
      );

      // 18. Rate Limiting Test (Send 5 more logins to exceed 5 requests/15m -> 429)
      let got429 = false;
      for (let i = 0; i < 6; i++) {
        const resRL = await fetch(`${BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "student.test@ensta.dz", password: "p" })
        });
        if (resRL.status === 429) {
          got429 = true;
          break;
        }
      }
      assert(got429, "18. Rate limiting triggered on login attempts (429 Too Many Requests)");

    } catch (err) {
      console.error("Test execution exception:", err);
      failed++;
    } finally {
      console.log("\n============================================================");
      console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
      console.log("============================================================");
      server.close();
      process.exit(failed > 0 ? 1 : 0);
    }
  });
}

runTests();
