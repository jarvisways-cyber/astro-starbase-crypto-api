from dataclasses import dataclass, field
from typing import Optional


@dataclass
class CompositeReading:
    composite: float
    regime: str
    btc_price: float
    signals: dict
    watching: list
    last_updated: str

    @classmethod
    def from_dict(cls, data: dict) -> "CompositeReading":
        return cls(
            composite=data["composite"],
            regime=data["regime"],
            btc_price=data["btc_price"],
            signals=data.get("signals", {}),
            watching=data.get("watching", []),
            last_updated=data.get("last_updated", ""),
        )

    @property
    def fear_greed(self) -> Optional[float]:
        return self.signals.get("fear_greed")


@dataclass
class AssetGate:
    symbol: str
    gate: str  # "OPEN" or "BLOCKED"
    strategy: Optional[str] = None
    confidence: Optional[float] = None
    ascendancy: Optional[float] = None
    velocity: Optional[float] = None
    candle_pattern: Optional[str] = None
    regime: Optional[str] = None
    confluence: Optional[str] = None
    dimension_scores: dict = field(default_factory=dict)
    position: Optional[dict] = None

    @classmethod
    def from_dict(cls, symbol: str, data: dict) -> "AssetGate":
        return cls(
            symbol=symbol,
            gate=data.get("gate", "BLOCKED"),
            strategy=data.get("strategy"),
            confidence=data.get("confidence"),
            ascendancy=data.get("ascendancy"),
            velocity=data.get("velocity"),
            candle_pattern=data.get("candle_pattern"),
            regime=data.get("regime"),
            confluence=data.get("confluence"),
            dimension_scores=data.get("dimension_scores", {}),
            position=data.get("position"),
        )

    def __str__(self) -> str:
        return self.gate

    def __eq__(self, other) -> bool:
        if isinstance(other, str):
            return self.gate == other
        return NotImplemented


@dataclass
class AssetSnapshot:
    symbol: str
    ascendancy: float
    velocity: float
    sma200: Optional[float]
    gate: str

    @classmethod
    def from_dict(cls, symbol: str, data: dict) -> "AssetSnapshot":
        return cls(
            symbol=symbol,
            ascendancy=data.get("ascendancy", 0.0),
            velocity=data.get("velocity", 0.0),
            sma200=data.get("sma200"),
            gate=data.get("gate", "BLOCKED"),
        )
