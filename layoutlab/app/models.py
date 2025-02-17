from django.db import models
from django.contrib.auth.models import User

class Layout(models.Model):
    STATUS = [
    ('saved', 'Saved'),        
    ('live', 'Live'),   
    ('archived', 'Archived'),   
]    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='layouts')
    name = models.CharField(max_length=255)
    configuration = models.JSONField()  
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True, null=True) 
    status = models.CharField(max_length=50, choices=STATUS, default='saved')

class Template(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),        
        ('inactive', 'Inactive'),   
        ('archived', 'Archived'),   
    ]

    name = models.CharField(max_length=255)
    configuration = models.JSONField()  
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True, null=True) 
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='active')
