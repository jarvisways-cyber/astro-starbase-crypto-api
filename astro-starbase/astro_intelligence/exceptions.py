class ASTROError(Exception):
    """Base exception for all astro_intelligence errors."""


class ASTROAuthError(ASTROError):
    """Raised when the API key is missing, invalid, or expired (HTTP 401)."""


class ASTRORateLimitError(ASTROError):
    """Raised when the client exceeds the 1-request/15-min cycle limit (HTTP 429)."""

    def __init__(self, message: str, retry_after: int | None = None):
        super().__init__(message)
        self.retry_after = retry_after


class ASTROCycleNotReadyError(ASTROError):
    """Raised when the oracle is mid-cycle and no fresh reading is available yet."""
