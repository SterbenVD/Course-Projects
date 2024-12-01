from models import Package, Commit, Label
import random
import faker
from .constants import *

_faker = faker.Faker()

def benign_seed() -> tuple[Package, list[Commit]]:
    package = Package(
        name=_faker.name(),
        maintainer=_faker.user_name(),
        version=_faker.numerify('#.#.#'),
        upload_timestamp=_faker.date_time_this_month(),
        flag_count=int(random.expovariate(lambd=BENIGN_LAMBDA_FLAGS)),
        label=Label.BENIGN,
    )
    
    n_commits = random.randint(1, MAX_COMMITS)
    
    commits = [
        Commit(
            package_name=package.name,
            n_files=random.randint(1, BENIGN_MAX_FILES),
            n_adds=random.randint(0, BENIGN_MAX_DELTA),
            n_dels=random.randint(0, BENIGN_MAX_DELTA),
            n_links=random.randint(0, BENIGN_MAX_LINKS),
            max_dir_depth=random.randint(0, BENIGN_MAX_DEPTH),
            avg_dir_depth=0.4 * BENIGN_MAX_DEPTH + 0.2 * BENIGN_MAX_DEPTH * random.random(),
            med_file_size=random.expovariate(BENIGN_LAMBDA_FILESIZE),
            avg_file_size=(2 * random.random() - 1) * BENIGN_LAMBDA_FILESIZE,
            total_size=10 * BENIGN_LAMBDA_FILESIZE * random.random(),
            n_binaries=0,
        ) for _ in range(n_commits)
    ]
    return package, commits

def malicious_seed() -> tuple[Package, list[Commit]]:
    package = Package(
        name=_faker.name(),
        maintainer=_faker.user_name(),
        version=_faker.numerify('#.#.#'),
        upload_timestamp=_faker.date_time_this_month(),
        flag_count=int(random.expovariate(lambd=MALICIOUS_LAMBDA_FLAGS)),
        label=Label.MALICIOUS,
    )
    
    n_commits = random.randint(1, MAX_COMMITS)
    
    commits = [
        Commit(
            package_name=package.name,
            n_files=random.randint(1, MALICIOUS_MAX_FILES),
            n_adds=random.randint(0, MALICIOUS_MAX_DELTA),
            n_dels=random.randint(0, MALICIOUS_MAX_DELTA),
            n_links=random.randint(0, MALICIOUS_MAX_LINKS),
            max_dir_depth=random.randint(0, MALICIOUS_MAX_DEPTH),
            avg_dir_depth=0.4 * MALICIOUS_MAX_DEPTH + 0.2 * MALICIOUS_MAX_DEPTH * random.random(),
            med_file_size=random.expovariate(MALICIOUS_LAMBDA_FILESIZE),
            avg_file_size=(2 * random.random() - 1) * MALICIOUS_LAMBDA_FILESIZE,
            total_size=10 * MALICIOUS_LAMBDA_FILESIZE * random.random(),
            n_binaries=0,
        ) for _ in range(n_commits)
    ]
    return package, commits