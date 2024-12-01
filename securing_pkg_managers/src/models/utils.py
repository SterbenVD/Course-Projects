from enum import Enum

class Label(str, Enum):
    BENIGN = 'benign'
    MALICIOUS = 'malicious'