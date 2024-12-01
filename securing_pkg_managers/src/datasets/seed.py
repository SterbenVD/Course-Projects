from .utils import *
import random
import pandas as pd

def seed(
    n: int,
    repo_outfile: str = 'repos.csv',
    commits_outfile: str = 'commits.csv',
    malicious_ratio: float = 0.2,
    seed: int | None = None,
):
    assert 0 <= malicious_ratio <= 1, f'malicious_ratio should be a number between 0 and 1, got {malicious_ratio}.'
    if seed is not None:
        random.seed(seed)
    repos, commits = [], []
    for _ in range(n):
        p, c = None, None
        if random.random() < malicious_ratio:
            p, c = malicious_seed()
        else:
            p, c = benign_seed()
        repos.extend([p,])
        commits.extend(c,)
        df_repos = pd.DataFrame([vars(p) for p in repos])
        df_commits = pd.DataFrame([vars(c) for c in commits])
        df_repos.to_csv(repo_outfile)
        df_commits.to_csv(commits_outfile)
        
if __name__ == '__main__':
    seed(1000)