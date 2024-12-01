from datetime import datetime
from typing import Any
import faker
from .utils import Label

class Package:
    def __init__(
        self,
        name: str,
        maintainer: str,
        version: str,
        upload_timestamp: datetime,
        flag_count: int,
        label: Label,
    ) -> None:
        self.name = name
        self.maintainer = maintainer
        self.version = version
        self.upload_timestamp = upload_timestamp
        self.flag_count = flag_count
        self.label = label
