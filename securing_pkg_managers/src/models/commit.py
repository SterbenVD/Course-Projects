import hashlib
import os
from typing import Any

class Commit:
    def __init__(
        self,
        package_name: str,
        n_files: int,
        n_adds: int,
        n_dels: int,
        n_links: int,
        max_dir_depth: int,
        avg_dir_depth: float,
        med_file_size: float,
        avg_file_size: float,
        total_size: float,
        n_binaries: int,
        commit_hash: str = hashlib.sha256(os.urandom(32)).hexdigest()
    ) -> None:
        self.package_name = package_name
        self.n_files = n_files
        self.n_adds = n_adds
        self.n_dels = n_dels
        self.n_links = n_links
        self.max_dir_depth = max_dir_depth
        self.avg_dir_depth = avg_dir_depth
        self.med_file_size = med_file_size
        self.avg_file_size = avg_file_size
        self.total_size = total_size,
        self.n_binaries = n_binaries
        self.commit_hash = commit_hash
