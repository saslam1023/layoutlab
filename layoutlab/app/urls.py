
from django.urls import path
from . import views
from django.contrib.auth import views as auth_views
from .forms import CustomPasswordResetView, CustomPasswordResetConfirmView
from django.conf import settings
from django.conf.urls.static import static



urlpatterns = [
    path('', views.index, name='index'),
    path('home/', views.home, name='home'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register_view, name='register'),
    path('forgot-password/', CustomPasswordResetView.as_view(template_name='forgot_password.html'), name='forgot_password'),
    path('password-reset-request/', CustomPasswordResetView.as_view(template_name='password_reset_request.html'), name='password_reset_request'),
    path('password_reset/', CustomPasswordResetView.as_view(template_name='password_reset.html'), name='password_reset'),
    path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(template_name='password_reset_done.html'), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', CustomPasswordResetConfirmView.as_view(template_name='password_reset_confirm.html'), name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(template_name='password_reset_complete.html'), name='password_reset_complete'),
    path('save/', views.save_layout, name='save_layout'),
    path('load/<str:item_id>/', views.load_item, name='load_item'),
    path('save-template/', views.save_template, name='save_template'),


    path('terms-of-use/', views.terms, name='terms'),
    path('privacy-policy/', views.privacy, name='privacy'),
    path('contact/', views.contact, name='contact'),
    path('about/', views.about, name='about'),
    path('cs50/', views.cs50, name='cs50'),

    path('get-recent-layouts/', views.get_recent_layouts, name='get_recent_layouts'),
    path('get-recent-templates/', views.get_recent_templates, name='get_recent_templates'),
    path('get-live-layouts/', views.get_live_layouts, name='get_live_layouts'),

    path('check-auth-status', views.check_auth_status, name='check_auth_status'),
    path('hub/', views.layouthub, name='layouthub'),
    path('get-layout-details/<int:layout_id>/', views.get_layout_details, name='get_layout_details'),
    path('<str:username>/', views.publichub, name='publichub'),
    path('save-thumbnail/', views.save_thumbnail, name='save_thumbnail'),


] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


