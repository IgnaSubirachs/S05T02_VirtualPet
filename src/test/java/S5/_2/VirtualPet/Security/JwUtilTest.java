package S5._2.VirtualPet.Security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
    }

    @Test
    void shouldGenerateToken() {
        String token = jwtUtil.generateToken("Ignasi");
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void shouldExtractUsernameFromToken() {
        String token = jwtUtil.generateToken("Ignasi");
        String username = jwtUtil.extractUsername(token);
        assertEquals("Ignasi", username);
    }

    @Test
    void shouldValidateTokenSuccessfully() {
        String token = jwtUtil.generateToken("Ignasi");
        boolean isValid = jwtUtil.validateToken(token);
        assertTrue(isValid);
    }

    @Test
    void shouldFailValidation_whenTokenIsInvalid() {
        String fakeToken = "this.is.a.fake.token";
        boolean isValid = jwtUtil.validateToken(fakeToken);
        assertFalse(isValid);
    }
}
