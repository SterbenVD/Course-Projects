import streamlit as st
import pandas as pd
from utils import connect_db, check_user, add_user, read_packages, check_repo, read_file, check_file_security, analyse_repo, submit_packages, list_submitted_packages, current_time, accept_package, reject_package, list_accepted_packages

package_db = "package_analysis.db"
auth_db = "auth.db"
conn_pkg, c_pkg = connect_db(package_db)
conn_auth, c_auth = connect_db(auth_db)
    
# Placeholder data for current page
if 'current_page' not in st.session_state:
    st.session_state.current_page = "User"
    
if 'username' not in st.session_state:
    st.session_state.username = ""
    
# Placeholder data for admin status
if 'admin' not in st.session_state:
    st.session_state.admin = False

# Placeholder data for previously analyzed packages
if 'previous_packages' not in st.session_state:
    st.session_state.previous_packages = pd.DataFrame({
        'Packages': [],
        'Status': [],
        'Time': None
    })
    
# Placeholder data for list of packages
if 'list_of_packages' not in st.session_state:
    st.session_state.list_of_packages = pd.DataFrame({
        'Name of Package': [],
        'Version': [],
        'Was Suspicious Before': []
    })
    
# Placeholder data for user login
if 'logged_in' not in st.session_state:
    st.session_state.logged_in = False

# Placeholder function for checking package security
def check_package_security_status(file):
    status_static = check_file_security(file)
    return status_static

def check_repository_link(repo):
    size = check_repo(repo)
    if size == None:
        st.warning("Failed to fetch repository details.")
    elif size > 50:
        st.warning("Big repository! Due to resource constraints, we cannot analyze repositories larger than 50 MB.")
    else:
        st.success(f"Repository size: {size} MB")
        return True
    return False

def check_package():
    with st.expander("Instructions"):
        st.write("Upload a Python package file to check its security status.")
        st.write("The package will be checked for security vulnerabilities.")
    st.header("Upload Package for Security Check")
    uploaded_file = st.file_uploader("Choose a package file", type=["py"], accept_multiple_files=False)
    if uploaded_file is not None:
        cur_time = current_time()
        file = read_file(uploaded_file)
        status = check_package_security_status(file)
        if status == "Secure":
            st.success("Package is secure.")
        else:
            st.error("Package is insecure.")
        st.session_state.previous_packages = pd.concat([
            st.session_state.previous_packages,
            pd.DataFrame([{'Packages': uploaded_file.name, 'Status': status, 'Time': cur_time}])
        ], ignore_index=True)
        
        
def check_repository():
    if st.session_state.logged_in:
        with st.expander("Instructions"):
            st.write("Enter the URL of a Git repository to check its security status.")
            st.write("The repository will be checked for security vulnerabilities.")
            st.write("Currently, only public GitHub repositories are supported.")
            st.write("The repository should be of a reasonable size (less than 50 MB).")
            st.write("The repository link should be in the format: https://github.com/SterbenVD/ai5063-project")
        st.header("Check Repository for Security Status")
        repo_url = st.text_input("Repository URL")
        if st.button("Submit"):
            exists = check_repository_link(repo_url)
            if exists:
                status = analyse_repo(repo_url)
                if status:
                    st.success("Repository is secure.")
                    result = submit_packages(repo_url, st.session_state.username, conn_pkg, c_pkg)
                    print(result)
                    if result > 0:
                        st.success("Repository submitted successfully.")
                    else:
                        st.error("Repository could not be submitted.")
                        if result == -1:
                            st.warning("Error in submission.")
                        elif result == -2:
                            st.warning("Max limit reached.")
                        elif result == -3:
                            st.warning("Repository already exists.")
                else:
                    st.error("Repository is insecure.")
            else:
                st.error("Cannot run analysis")
                
    else:
        st.warning("Please log in to access this feature.")

def load_previous_packages():
    st.header("Previous Package Analyses")
    if not st.session_state.previous_packages.empty:
        st.table(st.session_state.previous_packages)
    else:
        st.warning("No previous analyses found.")

def load_list_of_packages():
    st.session_state.list_of_packages = read_packages(conn_pkg)
    print("Loaded list of packages")

@st.cache_data
def load_cached_list_of_packages():
    st.session_state.list_of_packages = read_packages(conn_pkg)
    print("Loaded list of packages")

def list_packages():
    st.header("List of Packages")
    load_cached_list_of_packages()
    if st.session_state.list_of_packages.empty:
        # Uncached function to load data
        load_list_of_packages()
    st.table(st.session_state.list_of_packages)
    st.header("Accepted Packages")
    df = list_accepted_packages(conn_pkg)
    if not df.empty:
        df = df.drop(columns=['id'])
        st.table(df)
    else:
        st.warning("No accepted packages found.")
    
def logout():
    if st.button("Logout"):
        st.session_state.logged_in = False
        st.session_state.admin = False
        st.rerun()
    
def login_tab():
    st.header("Login")
    username = st.text_input("User Name")
    password = st.text_input("Password", type="password")
    if st.button("Login"):
        user = check_user(username, password, c_auth)
        if user:
            if user[3] == 1:
                st.session_state.admin = True
            st.session_state.logged_in = True
            st.session_state.username = username
            st.rerun()
        else:
            st.error("Invalid credentials.")

def admin_tab():
    st.header("Admin Panel")
    tabs = st.tabs(["Add User", "Add Submitted Packages", "Logout"])
    with tabs[0]:
        st.subheader("Add User")
        new_username = st.text_input("User Name")
        new_password = st.text_input("Password", type="password")
        new_admin = st.checkbox("Admin")
        if st.button("Add User"):
            if add_user(new_username, new_password, new_admin, c_auth, conn_auth) is not None:
                st.success("User added successfully.")
            else:
                st.error("User could not be added.")
            
    with tabs[1]:
        st.subheader("Add Submitted Packages")
        df = list_submitted_packages(conn_pkg)
        df = df[df['accepted'] == 0]
        df.drop(columns=['username', 'id', 'accepted'], inplace=True)
        if df.empty:
            st.warning("No submitted packages found.")
        else:
            selected = st.selectbox("Select Package", df['repo_link'])
            current_link = selected
            print(current_link)
            if st.button("Accept"):
                success = accept_package(current_link, st.session_state.username, conn_pkg, c_pkg)
                st.rerun()
            if st.button("Reject"):
                success = reject_package(current_link, conn_pkg, c_pkg)
                st.rerun()
            # Display the info of the row selected
            st.subheader("Information")
            st.write(df[df['repo_link'] == selected])
        
    with tabs[2]:
        logout()
        
def user_tab():
    st.header("User Panel")
    
    tabs = st.tabs(["Previous Package Analysis","Submitted Packages", "Logout"])
    with tabs[0]:
        load_previous_packages()
    with tabs[1]:
        st.subheader("Submitted Packages")
        df = list_submitted_packages(conn_pkg, st.session_state.username)
        df['accepted'] = df['accepted'].apply(lambda x: "Pending" if x == 0 else "Accepted" if x == 1 else "Rejected")
        df.drop(columns=['username'], inplace=True)
        df.drop(columns=['id'], inplace=True)
        if not df.empty:
            st.table(df)
        else:
            st.warning("No submitted packages found.")
    
    with tabs[2]:
        logout()

def app():
    st.title("Package Security Analysis")
    options = ["Package Analysis", "List of Packages", "User"]
    st.sidebar.title("Navigation")
    for option in options:
        if st.sidebar.button(option):
            st.session_state.current_page = option
    if st.session_state.current_page == "Package Analysis":
        tabs = st.tabs(["Check Package", "Check Repository"])
        with tabs[0]:
            check_package()
        with tabs[1]:
            check_repository()
    elif st.session_state.current_page == "List of Packages":
        list_packages()
    elif st.session_state.current_page == "User":
        if st.session_state.logged_in:
            if st.session_state.admin:
                admin_tab()
            else:
                user_tab()
        else:
            login_tab()
        
if __name__ == "__main__":
    app()
    conn_pkg.close()
    conn_auth.close()