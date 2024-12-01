import sqlite3
import hashlib
import pandas as pd
import requests
from io import StringIO
import numpy as np
import math
from pydriller import Repository
import datetime
# from keras.models import load_model

def current_time():
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

sec_db = "security.db"
import_db = "package_analysis.db"
ml_model = "model.h5"


def github_repo_stringify(repo):
    # Check if the input is in the format "https://github.com/owner/repo"
    if repo.startswith("https://github.com/"):
        if repo.endswith("/") or repo.endswith(".git"):
            return None, None
        repo = repo.split("/")
        if len(repo) != 5:
            return None, None
        
        owner = repo[-2]
        repo_name = repo[-1]
    else:
        return None, None
    return owner, repo_name

def get_github_repo_size(owner, repo_name):
    """
    Get the size of a GitHub repository before cloning.
    Args:
    - owner: GitHub username or organization name
    - repo_name: Repository name
    
    Returns:
    - size_in_mb: Size of the repository in MB
    """
    
    if owner is None or repo_name is None:
        return None
    
    # GitHub API URL for the repository
    api_url = f"https://api.github.com/repos/{owner}/{repo_name}"
    
    # Make a GET request to fetch repository details
    response = requests.get(api_url)
    if response.status_code == 200:
        repo_data = response.json()
        size_in_kb = repo_data.get("size", 0)  # Repository size in KB
        size_in_mb = size_in_kb / 1024  # Convert to MB
        return size_in_mb
    else:
        print(f"Failed to fetch repository details: {response.status_code}")
        return None
   
def check_repo(repo):
    owner, repo_name = github_repo_stringify(repo)
    return get_github_repo_size(owner, repo_name)
    
def read_file(file):
    return StringIO(file.getvalue().decode("utf-8")).read()
    
'''
Two databases
I) package_analysis.db
II) security.db

I) package_analysis.db
Two tables:
a) List of packages
b) Package Info/Commits

a) List of Packages:
1) Name/ID
2) Maintainer
3) Version Number
4) First Uploaded
5) Was Suspicious before?

b) Package Info
1) Number of files
2) Total additions
3) Total deletions
4) Links
5) Stats(avg, max) of Directory depth
6) Stats(avg, median) of file size
7) Total Size
8) Presence of executables(Binary)
9) Commit Hash
10) Time since last commit
11) Upload Time
12) Dependency Count

II) security.db
Three tables:
a) Keywords
b) Vulnerabilities
c) Hashes
'''

def connect_db(db):
    conn = sqlite3.connect(db)
    c = conn.cursor()
    return conn, c

def list_accepted_packages(conn_pkg):
    return pd.read_sql_query("SELECT * FROM accepted_packages", conn_pkg)

def accept_package(repo, username, conn_pkg, c_pkg):
    res = c_pkg.execute("SELECT maintainer, repo_name FROM submitted_packages WHERE repo_link = ?", (repo,))
    owner, repo_name = res.fetchone()
    c_pkg.execute("INSERT INTO accepted_packages (maintainer, repo_name, repo_link, accepted_by) VALUES (?, ?, ?, ?)", (owner, repo_name, repo, username))
    c_pkg.execute("UPDATE submitted_packages SET accepted = 1 WHERE maintainer = ? AND repo_name = ?", (owner, repo_name))
    conn_pkg.commit()
    return c_pkg.lastrowid

def reject_package(repo, conn_pkg, c_pkg):
    c_pkg.execute("UPDATE submitted_packages SET accepted = -1 WHERE repo_link = ?", (repo,))
    conn_pkg.commit()
    return c_pkg.lastrowid
    

def submit_packages(repo, username, conn_pkg, c_pkg):
    owner, repo_name = github_repo_stringify(repo)
    if owner is None or repo_name is None:
        return -1 # Error
    if list_submitted_packages(conn_pkg, username).shape[0] >= 5:
        return -2 # Limit reached
    present = c_pkg.execute("SELECT * FROM submitted_packages WHERE maintainer = ? AND repo_name = ?", (owner, repo_name))
    if present.fetchone():
        return -3 # Already submitted
    c_pkg.execute("INSERT INTO submitted_packages (username, maintainer, repo_name, repo_link, accepted) VALUES (?, ?, ?, ?, ?)", (username, owner, repo_name, repo, 0))
    conn_pkg.commit()
    return c_pkg.lastrowid

def list_submitted_packages(conn_pkg, username = ""):
    if username == "":
        return pd.read_sql_query("SELECT * FROM submitted_packages", conn_pkg)
    return pd.read_sql_query(f"SELECT * FROM submitted_packages WHERE username = '{username}'", conn_pkg)
    

def check_imports(file_content):
    imports = []
    for line in file_content.splitlines():
        if line.startswith("import") or line.startswith("from"):
            imports.append(line.split(" ")[1])
    conn, c =connect_db(import_db)
    for imp in imports:
        # Check if the import is in the database
        # If it is, check whether it was suspicious before
        res = c.execute("SELECT was_suspicious_before FROM packages WHERE name = ?", (imp,))
        if res.fetchone():
            if res.fetchone()[0] == 1:
                return "Insecure"
    return "Secure"

def hash_file(file_content):
    # Hash the contents of the file
    sha256 = hashlib.sha256()
    sha256.update(file_content.encode())
    # Check if the hash is in the database
    conn, c =connect_db(sec_db)
    c.execute("SELECT * FROM hashes WHERE hash = ?", (sha256.hexdigest(),))
    if c.fetchone():
        return "Insecure"
    else:
        return "Secure", sha256.hexdigest()

def check_keywords(file_content):
    # Check the file contents for malicious keywords
    conn, c =connect_db(sec_db)
    for line in file_content.splitlines():
        lower_line = line.lower()
        for keyword in c.execute("SELECT keyword FROM keywords"):
            if keyword[0] in lower_line:
                return "Insecure"
    return "Secure"

def check_file_security(file_content):
    # Check the file contents for security issues
    hash_status, hash_value = hash_file(file_content)
    keyword_status = check_keywords(file_content)
    import_status = check_imports(file_content)

    if hash_status == "Insecure" or keyword_status == "Insecure" or import_status == "Insecure":
        if hash_status == "Secure":
            conn, c =connect_db(sec_db)
            c.execute("INSERT INTO hashes VALUES (?)", (hash_value,))
            conn.commit()
            conn.close()
        return "Insecure"
    else:
        return "Secure"

def load_stats_repo(repo):
    return commit_info(repo)

def analyse_repo(repo):
    # stats = load_stats_repo()
    # Load the model
    # model = load_model(ml_model)
    # Predict the security status of the repository
    # return model.predict(stats)
    return True

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def check_user(username, password, c):
    c.execute(f"SELECT * FROM users WHERE username = '{username}' AND password = '{hash_password(password+username)}'")
    return c.fetchone()

def add_user(username, password, is_admin, c, conn):
    if username == "" or password == "":
        return -1
    c.execute(f"INSERT INTO users (username, password, is_admin) VALUES ('{username}', '{hash_password(password+username)}', {is_admin})")
    conn.commit()
    return c.lastrowid

def read_packages(conn_pkg):
    list_of_packages = pd.read_sql_query("SELECT name as 'Name of Package', version as Version, was_suspicious_before as 'Was Suspicious Before' FROM packages", conn_pkg)
    list_of_packages["Was Suspicious Before"] = list_of_packages["Was Suspicious Before"].apply(lambda x: "Yes" if x == 1 else "No")
    return list_of_packages

def commit_info(repo):
    commits = Repository(repo).traverse_commits()
    commit_info = []
    total_lines = 0
    prev_commit = None
    for commit in commits:
        total_lines += commit.insertions + commit.deletions
        time_since_last_commit = datetime.timedelta(0) if prev_commit is None else commit.committer_date - prev_commit.committer_date
        time_since_last_commit = time_since_last_commit.total_seconds() / (24 * 60 * 60)
        delta_size = sum([abs(len(f.content) - len(f.content_before)) for f in commit.modified_files]) # type: ignore
        commit_info.append({
            'timestamp': commit.committer_date,
            'name': commit.project_name,
            'n_files': commit.files,
            'n_adds': commit.insertions,
            'n_dels': commit.deletions,
            'delta_size': delta_size,
            'hash': commit.hash,
            'time_since_last_commit': time_since_last_commit,
            'dmm_unit_size': commit.dmm_unit_size,
            'dmm_unit_complexity': commit.dmm_unit_complexity,
            'dmm_unit_interfacing': commit.dmm_unit_interfacing,
        })
        prev_commit = commit
    return commit_info

def distribution(mean, std):
    return np.random.normal(mean, std)

def sigmoid(x):
    return 1/(1+np.exp(-x))

def ceil(x):
    return math.ceil(x)