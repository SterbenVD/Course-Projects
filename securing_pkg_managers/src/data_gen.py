'''
Create Synthetic dataset for Usecase: Securing Package Managers against Attacks.
This is how Dataset should look like:
Two tables:
a) List of packages
b) Package Info/Commits
c) Submitted Packages
d) Accepted Packages

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
6) Stats(avg) of file size
7) Total Size
8) Presence of executables(Binary)
9) Commit Hash
10) Time since last commit
11) Upload Time
12) Dependency Count

c) Submitted Packages
1) Username
2) Maintainer
3) Package Name
4) Repository Link
5) Accepted

d) Accepted Packages
1) Name/ID
2) Maintainer
3) Repository Link
4) Accepted by
'''

'''
Also create a database for authentication
1 table: Users
1) ID
2) Username
3) Password
4) Is Admin
'''

'''
Also create a database for security
3 tables:
1) Hashes
2) Keywords
'''

import pandas as pd
import numpy as np
import random
import datetime
import hashlib
import os
import faker
import sqlite3
from utils import connect_db, hash_password, distribution, sigmoid, ceil

package_db = "package_analysis.db"
auth_db = "auth.db"
security_db = "security.db"

def init_dbs():
    # Initialize the database
    conn = sqlite3.connect(package_db)
    c = conn.cursor()
    
    c.execute('''CREATE TABLE IF NOT EXISTS packages
                 (id INTEGER PRIMARY KEY, name TEXT, maintainer TEXT, version TEXT, first_uploaded TEXT, was_suspicious_before INTEGER)''')
    c.execute('''CREATE TABLE IF NOT EXISTS package_info
                 (id INTEGER PRIMARY KEY, package_id INTEGER, num_files INTEGER, total_additions INTEGER, total_deletions INTEGER, links INTEGER, 
                 avg_dir_depth REAL, max_dir_depth INTEGER, avg_file_size REAL, total_size INTEGER, has_executables INTEGER, 
                 commit_hash TEXT, time_since_last_commit INTEGER, upload_time TEXT, dependency_count INTEGER, was_suspicious_before INTEGER)''')
    c.execute('''CREATE TABLE IF NOT EXISTS submitted_packages
                    (id INTEGER PRIMARY KEY, username TEXT, maintainer TEXT, repo_name TEXT, repo_link TEXT UNIQUE, accepted INTEGER)''')
    c.execute('''CREATE TABLE IF NOT EXISTS accepted_packages
                    (id INTEGER PRIMARY KEY, maintainer TEXT, repo_name TEXT, repo_link TEXT UNIQUE, accepted_by TEXT)''')
    conn.commit()
    conn.close()
    
    conn = sqlite3.connect(auth_db)
    c = conn.cursor()
    
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY, username TEXT, password TEXT, is_admin INTEGER)''')
    
    conn.commit()
    conn.close()
    
    conn = sqlite3.connect(security_db)
    c = conn.cursor()
    
    c.execute('''CREATE TABLE IF NOT EXISTS hashes (id INTEGER PRIMARY KEY, hash TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS keywords (id INTEGER PRIMARY KEY, keyword TEXT)''')
    
    conn.commit()
    conn.close()
    
def reset_dbs():
    conn = sqlite3.connect(package_db)
    c = conn.cursor()
    c.execute("DROP TABLE IF EXISTS packages")
    c.execute("DROP TABLE IF EXISTS package_info")
    c.execute("DROP TABLE IF EXISTS submitted_packages")
    c.execute("DROP TABLE IF EXISTS accepted_packages")
    conn.commit()
    conn.close()
    
    conn = sqlite3.connect(auth_db)
    c = conn.cursor()
    c.execute("DROP TABLE IF EXISTS users")
    conn.commit()
    conn.close()
    
    conn = sqlite3.connect(security_db)
    c = conn.cursor()
    c.execute("DROP TABLE IF EXISTS hashes")
    c.execute("DROP TABLE IF EXISTS keywords")
    conn.commit()
    conn.close()
    
    init_dbs()
    
# Constants for package generation
NUM_PACKAGES = 10000
NUM_COMMITS = 300
NUM_FILES = 50
MAX_LINKS = 50
MAX_DIR_DEPTH = 16
MAX_FILE_SIZE = 1000
MAX_DEPENDENCY_COUNT = 100
MAX_LINE_CHANGES = 5000
PRESENCE_EXECUTABLE_BENIGN = 0.001
PRESENCE_EXECUTABLE_MALICIOUS = 0.05
SUSPICIOUS_5 = 12
SUSPICIOUS_MULTIPLIER = 3
SUSPICIOUS_RATIO = 30

# Constants for user generation
NUM_USERS = 10

def gen_packages():
    fake = faker.Faker()
    packages = []
    for i in range(NUM_PACKAGES):
        suspicious = random.randint(0,SUSPICIOUS_5)
        if suspicious < 5:
            suspicious = 1
        else:
            suspicious = 0
        package = {
            'name': fake.word(),
            'maintainer': fake.name(),
            'version': fake.numerify(text="#.#.#"),
            'first_uploaded': fake.date_time_this_decade(),
            'suspicious': suspicious
        }
        packages.append(package)
    conn, c = connect_db(package_db)
    for package in packages:
        c.execute("INSERT INTO packages (name, maintainer, version, first_uploaded, was_suspicious_before) VALUES (?, ?, ?, ?, ?)", (package['name'], package['maintainer'], package['version'], package['first_uploaded'], package['suspicious']))
    conn.commit()
    conn.close()
    return packages

def first_commit(first_uploaded, package_id):
    num_files = random.randint(1, NUM_FILES)
    avg_dir_depth = random.randint(1, MAX_DIR_DEPTH)
    avg_file_size = random.randint(1, MAX_FILE_SIZE)
    total_lines = random.randint(1, MAX_LINE_CHANGES)
    return {
        'package_id': package_id,
        'num_files': num_files,
        'total_additions': total_lines,
        'total_deletions': 0,
        'links': random.randint(0, MAX_LINKS),
        'avg_dir_depth': avg_dir_depth,
        'max_dir_depth': random.randint(avg_dir_depth, MAX_DIR_DEPTH),
        'avg_file_size': avg_file_size,
        'total_size': num_files * avg_file_size,
        'has_executables': 0,
        'time_since_last_commit': 0,
        'upload_time': first_uploaded,
        'dependency_count': random.randint(0, MAX_DEPENDENCY_COUNT),
        'commit_hash': hashlib.sha256(str(random.randint(0, 1000000000)).encode()).hexdigest()
    }, total_lines
    
    
# Model the next commit in a way such that it is related to the previous commit
# Like P(1 + X) where P is the previous commit, X is the changer between -1 and 1
# X is a function of the total lines changed in the previous commit and the time since last commit and the suspiciousness of the previous commit

def changer(suspicious):
    change = sigmoid(distribution(0, (0.2+suspicious*SUSPICIOUS_RATIO)))-0.5
    return change

def changed_value(prev_value, suspicious):
    new_value = prev_value * (1 + changer(suspicious))
    # Return integer value
    if new_value < 1:
        return 1
    if new_value <= prev_value:
        return ceil(new_value)
    return int(new_value)

def has_executables(suspicious):
    if suspicious == 1:
        return random.randint(0, 1000) /1000 < PRESENCE_EXECUTABLE_MALICIOUS
    else:
        return random.randint(0, 1000) /1000 < PRESENCE_EXECUTABLE_BENIGN

def next_commit(prev_commit, time_since_last_commit, suspicious, total_lines):
    total_new_lines = ceil(total_lines*(1+changer(suspicious)))
    # Total additions and deletions
    additions = 0
    deletions = 0
    if total_new_lines > total_lines:
        additions =int((total_new_lines - total_lines)*random.uniform(1, 1.75))
        deletions = total_lines + additions - total_new_lines
    else:
        deletions = int((total_lines - total_new_lines)*random.uniform(1, 1.75))
        additions = total_lines + deletions - total_new_lines
        
    num_files = changed_value(prev_commit['num_files'], suspicious)
    avg_file_size = changed_value(prev_commit['avg_file_size'], suspicious)
    
    return {
        'package_id': prev_commit['package_id'],
        'num_files': changed_value(prev_commit['num_files'], suspicious),
        'total_additions': additions,
        'total_deletions': deletions,
        'links': changed_value(prev_commit['links'], suspicious),
        'avg_dir_depth': changed_value(prev_commit['avg_dir_depth'], suspicious),
        'max_dir_depth': changed_value(prev_commit['max_dir_depth'], suspicious),
        'avg_file_size': avg_file_size,
        'total_size': num_files * avg_file_size,
        'has_executables': has_executables(suspicious),
        'time_since_last_commit': time_since_last_commit,
        'upload_time': prev_commit['upload_time'] + datetime.timedelta(seconds=time_since_last_commit),
        'dependency_count': changed_value(prev_commit['dependency_count'], suspicious),
        'commit_hash': hashlib.sha256(str(random.randint(0, 1000000000)).encode()).hexdigest()      
    }, total_new_lines

def gen_commits(package):
    name = package['name']
    conn, c = connect_db(package_db)
    c.execute("SELECT id FROM packages WHERE name=?", (name,))
    package_id = c.fetchone()[0]
    suspicious = package['suspicious']
    
    if suspicious == 1:
        number_of_commits = random.randint(SUSPICIOUS_RATIO, NUM_COMMITS)
    else:
        number_of_commits = random.randint(SUSPICIOUS_RATIO, NUM_COMMITS)
        
    first_uploaded = package['first_uploaded']
    
    commit_times = []
    commit_times.append(first_uploaded)
    for i in range(number_of_commits-1):
        # From first uploaded to now
        commit_time = first_uploaded + datetime.timedelta(seconds=random.randint(0, int((datetime.datetime.now() - first_uploaded).total_seconds())))
        commit_times.append(commit_time)
    
    commit_times.sort()
    
    first_commit_info, total_lines = first_commit(first_uploaded, package_id)
    
    sus_commits = []
    if suspicious:
        sus_commits.append(random.sample(range(1, number_of_commits),
                                    random.randint(1, number_of_commits//SUSPICIOUS_MULTIPLIER)))
        sus_commits.sort()
    package_info = first_commit_info
    conn, c = connect_db(package_db)
    for i in range(number_of_commits):
        if i != 0:
            if i in sus_commits:
                package_info, total_lines = next_commit(package_info, (commit_times[i] - commit_times[i-1]).total_seconds(), 1, total_lines)
            else:
                package_info, total_lines = next_commit(package_info, (commit_times[i] - commit_times[i-1]).total_seconds(), 0, total_lines)
        c.execute("INSERT INTO package_info (package_id, num_files, total_additions, total_deletions, links, avg_dir_depth, max_dir_depth, avg_file_size, total_size, has_executables, commit_hash, time_since_last_commit, upload_time, dependency_count, was_suspicious_before) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", (package_info['package_id'], package_info['num_files'], package_info['total_additions'], package_info['total_deletions'], package_info['links'], package_info['avg_dir_depth'], package_info['max_dir_depth'], package_info['avg_file_size'], package_info['total_size'], package_info['has_executables'], package_info['commit_hash'], package_info['time_since_last_commit'], package_info['upload_time'], package_info['dependency_count'], suspicious))
    conn.commit()
    conn.close()

def gen_package_info():
    packages = gen_packages()
    for package in packages:
        print(f"Generating commits for package {package['name']}")
        gen_commits(package)

def gen_users():
    # Admin and user
    conn, c = connect_db(auth_db)
    c.execute("INSERT INTO users (username, password, is_admin) VALUES (?, ?, ?)", ("admin", hash_password("adminadmin"), 1))
    c.execute("INSERT INTO users (username, password, is_admin) VALUES (?, ?, ?)", ("user", hash_password("useruser"), 0))
    conn.commit()
    conn.close()
    
def main():
    reset_dbs()
    gen_package_info()
    gen_users()
    
if __name__ == '__main__':
    main()