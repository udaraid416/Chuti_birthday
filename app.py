import streamlit as st
import base64
import os

# Page Configuration
st.set_page_config(
    page_title="Happy Birthday My Love! ❤️",
    page_icon="💖",
    layout="wide"
)

# Custom CSS for Next-Level Styling
st.markdown("""
<style>
    .main {
        background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);
    }
    .title-text {
        font-size: 45px;
        font-weight: bold;
        color: #d63384;
        text-align: center;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
    }
    .subtitle-text {
        font-size: 22px;
        color: #444;
        text-align: center;
        margin-bottom: 30px;
    }
    .card {
        background-color: white;
        padding: 25px;
        border-radius: 20px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        margin-bottom: 20px;
    }
    h2, h3 {
        color: #c71585;
    }
</style>
""", unsafe_allow_html=True)

# Background Audio Function (Autoplay)
def play_background_audio(file_path):
    if os.path.exists(file_path):
        with open(file_path, "rb") as f:
            data = f.read()
            encoded = base64.b64encode(data).decode()
        audio_html = f'<audio autoplay loop><source src="data:audio/mp3;base64,{encoded}" type="audio/mp3"></audio>'
        st.markdown(audio_html, unsafe_allow_html=True)

# Call Audio Function (Make sure you put song.mp3 inside assets/audio/)
play_background_audio("assets/audio/song.mp3")

# Header Section
st.markdown('<p class="title-text">Happy 24th Birthday My Queen! 👑💖</p>', unsafe_allow_html=True)
st.markdown('<p class="subtitle-text">October 20, 2026 - You are my everything! ✨</p>', unsafe_allow_html=True)

# Trigger Balloons Animation
st.balloons()

# Navigation Tabs
tab1, tab2, tab3 = st.tabs(["🌟 Birthday Wish", "📸 Our Memories", "🎵 Romantic Vibe"])

with tab1:
    st.markdown("""
    <div class="card">
        <h2>මගේ පණට, සුභම සුභ උපන් දිනයක් වේවා! 💕</h2>
        <p style="font-size: 18px; line-height: 1.6; color: #333;">
        ඔයාගේ මේ විශේෂ දවසේ ඔයාට කියන්න ඕන වුණේ ඔයා මගේ ජීවිතයට ආපු ලස්සනම එළිය කියලා. මගේ සතුට, මගේ හිනාව හැමදේම ඔයා. අද වගේම හැමදාමත් ඔයාට සතුටින්, ආදරයෙන් ඉන්න ලැබෙන්න කියලා මම ප්‍රාර්ථනා කරනවා. මම ඔයාට ගොඩාක් ආදරෙයි මැණික! ❤️
        </p>
    </div>
    """, unsafe_allow_html=True)

with tab2:
    st.markdown("### අපේ සුන්දර මතක සටහන් 📸")
    col1, col2 = st.columns(2)
    
    img1_path = "assets/images/photo1.jpg"
    img2_path = "assets/images/photo2.jpg"
    
    with col1:
        if os.path.exists(img1_path):
            st.image(img1_path, caption="Our Special Moment ❤️", use_column_width=True)
        else:
            st.info("පළමු පින්තූරය `assets/images/photo1.jpg` ලෙස ඇතුළත් කරන්න.")
            
    with col2:
        if os.path.exists(img2_path):
            st.image(img2_path, caption="Always Together ✨", use_column_width=True)
        else:
            st.info("දෙවන පින්තූරය `assets/images/photo2.jpg` ලෙස ඇතුළත් කරන්න.")

with tab3:
    st.markdown("### ආදරණීය සංගීතය 🎶")
    st.write("පසුබිමින් ඇහෙන සංගීතයත් සමඟ මේ විශේෂ මොහොත විඳින්න...")
    audio_file_path = "assets/audio/song.mp3"
    if os.path.exists(audio_file_path):
        st.audio(audio_file_path)
    else:
        st.warning("කරුණාකර `assets/audio/song.mp3` වෙත ඔබේ සින්දුව එකතු කරන්න.")
