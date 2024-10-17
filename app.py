import streamlit as st
import firebase_admin
from firebase_admin import credentials, auth

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    cred = credentials.Certificate("firebase-key.json")
    firebase_admin.initialize_app(cred)

# Super Admin credentials
SUPER_ADMIN_EMAIL = "devanr2911@gmail.com"  # Replace with your Super Admin email
SUPER_ADMIN_PASSWORD = "112233"  # Replace with your Super Admin password

# Function to login using Firebase Authentication
def login_with_email_password(email, password):
    try:
        user = auth.get_user_by_email(email)
        return user
    except firebase_admin.auth.UserNotFoundError:
        return None

# Function to sign up new users
def signup_with_email_password(email, password):
    try:
        user = auth.create_user(email=email, password=password)
        # Set custom user claims for role
        auth.set_custom_user_claims(user.uid, {'role': 'user'})  # Default role for all new users
        return user
    except Exception as e:
        st.error(f"Sign up failed: {str(e)}")
        return None

# Login/Signup page
def login_signup_page():
    st.title("Login & Signup Page")

    option = st.selectbox("Pilih opsi:", ("Login", "Signup"))

    email = st.text_input("Email")
    password = st.text_input("Password", type="password")

    if option == "Login":
        if st.button("Login"):
            # Check if the user is the Super Admin
            if email == SUPER_ADMIN_EMAIL and password == SUPER_ADMIN_PASSWORD:
                st.session_state['logged_in'] = True
                st.session_state['email'] = email
                st.session_state['role'] = 'super admin'  # Assign the Super Admin role
                st.success("Login sebagai Super Admin berhasil!")
                st.experimental_rerun()  # Redirect to home page
            else:
                user = login_with_email_password(email, password)
                if user:
                    claims = auth.get_user(user.uid).custom_claims
                    role = claims.get('role', 'user')  # Default to 'user' if no role
                    st.session_state['logged_in'] = True
                    st.session_state['email'] = email
                    st.session_state['role'] = role
                    st.success("Login berhasil!")
                    st.experimental_rerun()  # Redirect to home page
                else:
                    st.error("Email atau password salah!")

    elif option == "Signup":
        if st.button("Signup"):
            user = signup_with_email_password(email, password)
            if user:
                st.success("Signup berhasil! Silakan login.")
                st.experimental_rerun()  # Redirect to login page

# Home page
def home_page():
    st.title(f"Welcome, {st.session_state['email']}")
    st.write("Ini adalah halaman Home utama.")

    if st.session_state['role'] == 'super admin':
        st.write("Anda adalah Super Admin. Anda memiliki akses penuh.")
        if st.button("Lihat Daftar Pengguna"):
            users = auth.list_users().users
            for user in users:
                st.write(f"Email: {user.email}, UID: {user.uid}")

    # About panel
    if st.button("About"):
        st.session_state['page'] = 'about'
        st.experimental_rerun()  # Redirect to About page

    # Logout option
    if st.button("Logout"):
        st.session_state['logged_in'] = False
        st.session_state['email'] = None
        st.session_state['role'] = None
        st.experimental_rerun()  # Redirect to login page

# Routing function
def run_app():
    if 'logged_in' not in st.session_state or not st.session_state['logged_in']:
        login_signup_page()  # Redirect to login/signup page
    else:
        if st.session_state.get('page') == 'about':
            about_page()  # Redirect to About page
        else:
            home_page()  # Default to Home page after login

# About page
def about_page():
    st.title("About Us")
    st.write("Ini adalah halaman About yang berisi informasi tentang tim.")
    st.button("Kembali ke Home", on_click=lambda: st.session_state.update({"page": "home"}))

if __name__ == "__main__":
    run_app()
