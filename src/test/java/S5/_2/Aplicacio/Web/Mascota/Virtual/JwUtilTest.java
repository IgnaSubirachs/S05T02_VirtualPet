package S5._2.Aplicacio.Web.Mascota.Virtual;

import S5._2.VirtualPet.Security.JwtUtil;
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
        String token = jwtUtil.generateToken("ignasubirachs@gmail.com", "ROLE_USER");
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void shouldExtractUsernameFromToken() {
        String token = jwtUtil.generateToken("ignasubirachs@gmail.com", "ROLE_USER");
        String email = jwtUtil.extractUsername(token); // subject és l’email
        assertEquals("ignasubirachs@gmail.com", email);
    }

    @Test
    void shouldValidateTokenSuccessfully() {
        String token = jwtUtil.generateToken("ignasubirachs@gmail.com", "ROLE_USER");
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
