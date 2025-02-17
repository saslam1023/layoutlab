# forms.py
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.template.loader import render_to_string
from django.urls import reverse_lazy
from django.contrib.auth.views import PasswordResetView, PasswordResetConfirmView, PasswordResetDoneView


class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True, help_text="Required. Enter a valid email address.")

    class Meta:
        model = User
        fields = ("username", "email", "password1", "password2")

    def clean_email(self):
        email = self.cleaned_data.get("email")
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("A user with that email already exists.")
        return email



class CustomPasswordResetView(PasswordResetView):
    email_template_name = 'password_reset_email.html'  
    subject_template_name = 'password_reset_subject.txt'  
    success_url = reverse_lazy('password_reset_done')
    html_email_template_name = 'password_reset_email.html' 

    def send_mail(self, subject_template_name, email_template_name, context, from_email, to_email, html_email_template_name=None):
        subject = render_to_string(subject_template_name, context).strip()
        html_email = render_to_string(html_email_template_name, context)

        self.get_connection().send_mail(
            subject,
            '',  
            from_email,
            [to_email],
            html_message=html_email,
        )


class CustomPasswordResetConfirmView(PasswordResetConfirmView):
    success_url = reverse_lazy('password_reset_complete')  

class CustomPasswordResetDoneView(PasswordResetDoneView):
    success_url = reverse_lazy('password_reset_done')  
    
