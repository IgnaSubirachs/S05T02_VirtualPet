package S5._2.VirtualPet.Exception;

public class ReservedUsernameException extends RuntimeException {
    public ReservedUsernameException(String username) {

        super("The username '" + username + "' is reserved and cannot be registered.");
    }
}
