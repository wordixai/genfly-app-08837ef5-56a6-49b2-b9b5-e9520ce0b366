import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta

# Set page config
st.set_page_config(
    page_title="DateMate Analytics Dashboard",
    page_icon="❤️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        color: #FF4B4B;
        text-align: center;
        margin-bottom: 1rem;
    }
    .sub-header {
        font-size: 1.5rem;
        color: #333;
        margin-bottom: 1rem;
    }
    .metric-card {
        background-color: #f9f9f9;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .metric-value {
        font-size: 2rem;
        font-weight: bold;
        color: #FF4B4B;
    }
    .metric-label {
        font-size: 1rem;
        color: #666;
    }
</style>
""", unsafe_allow_html=True)

# Header
st.markdown("<h1 class='main-header'>DateMate Analytics Dashboard</h1>", unsafe_allow_html=True)

# Sidebar
st.sidebar.image("https://via.placeholder.com/150x150.png?text=DateMate", width=150)
st.sidebar.title("Filters")

# Date range filter
date_range = st.sidebar.selectbox(
    "Date Range",
    ["Last 7 days", "Last 30 days", "Last 90 days", "Year to date", "All time"]
)

# User segment filter
user_segment = st.sidebar.multiselect(
    "User Segment",
    ["All Users", "Free Users", "Premium Users", "New Users", "Inactive Users"],
    default=["All Users"]
)

# Location filter
location = st.sidebar.multiselect(
    "Location",
    ["Global", "North America", "Europe", "Asia", "Australia", "South America", "Africa"],
    default=["Global"]
)

# Age range filter
age_range = st.sidebar.slider("Age Range", 18, 65, (18, 65))

# Generate mock data
@st.cache_data
def generate_mock_data():
    # Date range
    end_date = datetime.now()
    start_date = end_date - timedelta(days=90)
    dates = pd.date_range(start=start_date, end=end_date, freq='D')
    
    # User growth
    base_users = 10000
    daily_growth = np.random.normal(loc=200, scale=50, size=len(dates))
    cumulative_users = base_users + np.cumsum(daily_growth)
    
    # Active users (DAU)
    dau_percentage = np.random.uniform(0.3, 0.4, size=len(dates))
    dau = cumulative_users * dau_percentage
    
    # Matches
    matches_per_active_user = np.random.uniform(0.1, 0.3, size=len(dates))
    daily_matches = dau * matches_per_active_user
    
    # Messages
    messages_per_match = np.random.uniform(3, 8, size=len(dates))
    daily_messages = daily_matches * messages_per_match
    
    # Premium conversions
    premium_conversion_rate = np.random.uniform(0.01, 0.03, size=len(dates))
    premium_conversions = dau * premium_conversion_rate
    
    # Revenue
    arpu = np.random.uniform(0.5, 1.5, size=len(dates))  # Average Revenue Per User
    daily_revenue = dau * arpu
    
    # Gender distribution
    gender_distribution = {
        'Male': 55,
        'Female': 42,
        'Non-binary': 3
    }
    
    # Age distribution
    age_distribution = {
        '18-24': 35,
        '25-34': 40,
        '35-44': 15,
        '45-54': 7,
        '55+': 3
    }
    
    # Swipe actions
    swipe_actions = {
        'Right (Like)': 45,
        'Left (Pass)': 50,
        'Up (Super Like)': 5
    }
    
    # Retention data
    days = [1, 3, 7, 14, 30, 60, 90]
    retention_rates = [95, 80, 65, 50, 35, 25, 20]
    
    # Combine into dataframes
    daily_df = pd.DataFrame({
        'date': dates,
        'total_users': cumulative_users,
        'active_users': dau,
        'matches': daily_matches,
        'messages': daily_messages,
        'premium_conversions': premium_conversions,
        'revenue': daily_revenue
    })
    
    return daily_df, gender_distribution, age_distribution, swipe_actions, days, retention_rates

daily_df, gender_distribution, age_distribution, swipe_actions, retention_days, retention_rates = generate_mock_data()

# Main dashboard
col1, col2, col3, col4 = st.columns(4)

with col1:
    st.markdown("<div class='metric-card'>", unsafe_allow_html=True)
    st.markdown("<p class='metric-value'>12,345</p>", unsafe_allow_html=True)
    st.markdown("<p class='metric-label'>Total Users</p>", unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)

with col2:
    st.markdown("<div class='metric-card'>", unsafe_allow_html=True)
    st.markdown("<p class='metric-value'>4,567</p>", unsafe_allow_html=True)
    st.markdown("<p class='metric-label'>Daily Active Users</p>", unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)

with col3:
    st.markdown("<div class='metric-card'>", unsafe_allow_html=True)
    st.markdown("<p class='metric-value'>1,234</p>", unsafe_allow_html=True)
    st.markdown("<p class='metric-label'>Matches Today</p>", unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)

with col4:
    st.markdown("<div class='metric-card'>", unsafe_allow_html=True)
    st.markdown("<p class='metric-value'>$9,876</p>", unsafe_allow_html=True)
    st.markdown("<p class='metric-label'>Revenue Today</p>", unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)

# User Growth Chart
st.markdown("<h2 class='sub-header'>User Growth</h2>", unsafe_allow_html=True)
fig_users = px.line(
    daily_df, 
    x='date', 
    y='total_users',
    title='Total Users Over Time',
    labels={'date': 'Date', 'total_users': 'Total Users'}
)
fig_users.update_layout(height=400)
st.plotly_chart(fig_users, use_container_width=True)

# User Engagement
st.markdown("<h2 class='sub-header'>User Engagement</h2>", unsafe_allow_html=True)
col1, col2 = st.columns(2)

with col1:
    fig_dau = px.line(
        daily_df, 
        x='date', 
        y='active_users',
        title='Daily Active Users',
        labels={'date': 'Date', 'active_users': 'Active Users'}
    )
    fig_dau.update_layout(height=350)
    st.plotly_chart(fig_dau, use_container_width=True)

with col2:
    fig_matches = px.line(
        daily_df, 
        x='date', 
        y='matches',
        title='Daily Matches',
        labels={'date': 'Date', 'matches': 'Matches'}
    )
    fig_matches.update_layout(height=350)
    st.plotly_chart(fig_matches, use_container_width=True)

# User Demographics
st.markdown("<h2 class='sub-header'>User Demographics</h2>", unsafe_allow_html=True)
col1, col2 = st.columns(2)

with col1:
    fig_gender = px.pie(
        values=list(gender_distribution.values()),
        names=list(gender_distribution.keys()),
        title='Gender Distribution',
        hole=0.4,
        color_discrete_sequence=px.colors.sequential.RdBu
    )
    fig_gender.update_layout(height=350)
    st.plotly_chart(fig_gender, use_container_width=True)

with col2:
    fig_age = px.bar(
        x=list(age_distribution.keys()),
        y=list(age_distribution.values()),
        title='Age Distribution',
        labels={'x': 'Age Group', 'y': 'Percentage (%)'},
        color=list(age_distribution.values()),
        color_continuous_scale='Reds'
    )
    fig_age.update_layout(height=350)
    st.plotly_chart(fig_age, use_container_width=True)

# User Behavior
st.markdown("<h2 class='sub-header'>User Behavior</h2>", unsafe_allow_html=True)
col1, col2 = st.columns(2)

with col1:
    fig_swipes = px.pie(
        values=list(swipe_actions.values()),
        names=list(swipe_actions.keys()),
        title='Swipe Actions',
        hole=0.4,
        color_discrete_sequence=px.colors.sequential.Plasma
    )
    fig_swipes.update_layout(height=350)
    st.plotly_chart(fig_swipes, use_container_width=True)

with col2:
    fig_retention = px.line(
        x=retention_days,
        y=retention_rates,
        title='User Retention',
        labels={'x': 'Days', 'y': 'Retention Rate (%)'},
        markers=True
    )
    fig_retention.update_layout(height=350)
    st.plotly_chart(fig_retention, use_container_width=True)

# Revenue Metrics
st.markdown("<h2 class='sub-header'>Revenue Metrics</h2>", unsafe_allow_html=True)
col1, col2 = st.columns(2)

with col1:
    fig_revenue = px.line(
        daily_df, 
        x='date', 
        y='revenue',
        title='Daily Revenue',
        labels={'date': 'Date', 'revenue': 'Revenue ($)'}
    )
    fig_revenue.update_layout(height=350)
    st.plotly_chart(fig_revenue, use_container_width=True)

with col2:
    fig_premium = px.line(
        daily_df, 
        x='date', 
        y='premium_conversions',
        title='Premium Conversions',
        labels={'date': 'Date', 'premium_conversions': 'Conversions'}
    )
    fig_premium.update_layout(height=350)
    st.plotly_chart(fig_premium, use_container_width=True)

# Footer
st.markdown("---")
st.markdown("DateMate Analytics Dashboard • Data refreshed daily • Last updated: " + datetime.now().strftime("%Y-%m-%d %H:%M:%S"))