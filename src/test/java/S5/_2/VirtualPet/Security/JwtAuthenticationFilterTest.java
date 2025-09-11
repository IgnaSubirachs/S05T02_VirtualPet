package S5._2.VirtualPet.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.mockito.Mockito.*;

class JwtAuthenticationFilterTest {

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @InjectMocks
    private JwtAuthenticationFilter filter;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        SecurityContextHolder.clearContext();
    }

    @Test
    void shouldSkipFilter_whenNoAuthorizationHeader() throws Exception {
        when(request.getHeader("Authorization")).thenReturn(null);

        filter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        // No autenticació
        assert(SecurityContextHolder.getContext().getAuthentication() == null);
    }

    @Test
    void shouldAuthenticateUser_whenValidToken() throws Exception {
        when(request.getHeader("Authorization")).thenReturn("Bearer validtoken");
        when(jwtUtil.extractUsername("validtoken")).thenReturn("Ignasi");
        when(jwtUtil.validateToken("validtoken")).thenReturn(true);

        filter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        assert(SecurityContextHolder.getContext().getAuthentication() != null);
        assert(SecurityContextHolder.getContext().getAuthentication().getName().equals("Ignasi"));
    }

    @Test
    void shouldNotAuthenticateUser_whenInvalidToken() throws Exception {
        when(request.getHeader("Authorization")).thenReturn("Bearer invalidtoken");
        when(jwtUtil.extractUsername("invalidtoken")).thenReturn("Ignasi");
        when(jwtUtil.validateToken("invalidtoken")).thenReturn(false);

        filter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);

        assert(SecurityContextHolder.getContext().getAuthentication() == null);
    }
}
