from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from .forms import CustomPasswordResetView, CustomUserCreationForm 
from django.contrib import messages
from django.http import JsonResponse
from .models import Layout, Template
from django.views.decorators.csrf import csrf_exempt
import json
from django.core.files.base import ContentFile
from django.utils.crypto import get_random_string
import base64
import os
from PIL import Image
from io import BytesIO

from django.core.files.uploadedfile import InMemoryUploadedFile
from django.http import HttpResponse


@login_required
def home(request):
    saved_layouts = Layout.objects.filter(user=request.user, status='saved').order_by('-created_at')[:4]
    
    live_layouts = Layout.objects.filter(user=request.user, status='live').order_by('-created_at')[:4]

    templates = Template.objects.filter(status='active').order_by('-created_at')[:4]

    return render(request, 'home.html', {
        'saved_layouts': saved_layouts,
        'live_layouts': live_layouts,
        'templates': templates,

    })    




def index(request):
    return render(request, 'index.html')

def terms(request):
    return render(request, 'terms-of-use.html')

def privacy(request):
    return render(request, 'privacy-policy.html')

def about(request):
    return render(request, 'about.html')

def contact(request):
    return render(request, 'contact.html')

def cs50(request):
    return render(request, 'cs50.html')




def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('home')
    else:
        form = AuthenticationForm()
    return render(request, 'login.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('home')

def register_view(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()

            messages.success(request, 'Registration successful! You can now log in.')
            return redirect('login')  
    else:
        form = CustomUserCreationForm()
    return render(request, 'register.html', {'form': form})


def forgot_password_view(request):
    return CustomPasswordResetView.as_view(template_name='forgot_password.html')(request)

def password_reset_view(request):
    return CustomPasswordResetView.as_view(template_name='password_reset_request.html')(request)

""" Original
@csrf_exempt
def save_layout(request):
    if request.method == 'POST':
        user = request.user if request.user.is_authenticated else None
        data = json.loads(request.body)
        layout, created = Layout.objects.update_or_create(
            user=user,
            name=data['name'],
            defaults={'configuration': data['configuration']}
        )
        return JsonResponse({'success': True, 'layout_id': layout.id})
    return JsonResponse({'success': False}, status=400)


@csrf_exempt
def load_layout(request, layout_id):
    try:
        layout = Layout.objects.get(name=layout_id)
        return JsonResponse({'configuration': layout.configuration})
    except Layout.DoesNotExist:
        return JsonResponse({'error': 'Layout not found'}, status=404)

        """


""" Last good save
@csrf_exempt
@login_required
def save_layout(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user = request.user if request.user.is_authenticated else None
            layout_name = data.get('name')
            configuration = data.get('configuration')
            layout, created = Layout.objects.update_or_create(
                user=user,
                name=layout_name,
                defaults={'configuration': configuration},
            )
            return JsonResponse({'success': True, 'layout_id': layout.id})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'success': False, 'error': 'Invalid request method'})

"""


@csrf_exempt
@login_required
def save_layout(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user = request.user if request.user.is_authenticated else None
            layout_name = data.get('name')
            configuration = data.get('configuration')
            thumbnail_data = data.get('thumbnail')  # Get base64 image

            # Create or update the Layout entry
            layout, created = Layout.objects.update_or_create(
                user=user,
                name=layout_name,
                defaults={'configuration': configuration},
            )

            # Handle the thumbnail if provided
            if thumbnail_data:
                try:
                    # Decode the base64 image
                    format, imgstr = thumbnail_data.split(';base64,')
                    img_data = base64.b64decode(imgstr)

                    # Generate a unique filename
                    image_name = f'thumbnail_{get_random_string(10)}.png'
                    image_path = f'media/thumbnails/{image_name}'

                    # Save the image to the Layout model
                    layout.thumbnail.save(image_name, ContentFile(img_data))
                    layout.save()

                except Exception as e:
                    return JsonResponse({'success': False, 'error': f'Error saving thumbnail: {str(e)}'})

            return JsonResponse({'success': True, 'layout_id': layout.id, 'thumbnail_url': layout.thumbnail.url})

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    
    return JsonResponse({'success': False, 'error': 'Invalid request method'})



"""
@csrf_exempt
@login_required
def save_layout(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            layout_id = data.get('id')
            
            if not layout_id or 'name' not in data or 'configuration' not in data:
                return JsonResponse({'success': False, 'error': 'Missing required fields: id, name, or configuration'}, status=400)
            
            # Update or create the layout
            layout, created = Layout.objects.update_or_create(
                user=request.user,
                id=layout_id,
                defaults={
                    'name': data['name'],
                    'configuration': data['configuration'],
                }
            )
            return JsonResponse({'success': True, 'layout_id': layout.id})
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)
        except KeyError as e:
            return JsonResponse({'success': False, 'error': f'Missing key: {str(e)}'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)

    return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)

@login_required
@staff_member_required  
def save_template(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            template_name = data.get('name')
            configuration = data.get('configuration')

            # Ensure required fields are present
            if not template_name or not configuration:
                return JsonResponse({'success': False, 'error': 'Missing required fields: name or configuration'}, status=400)

            # Create or update the template
            template, created = Template.objects.update_or_create(
                name=template_name,
                defaults={'configuration': configuration, 'status': 'active'},
            )
            return JsonResponse({'success': True, 'template_id': template.id})
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)

    return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)
"""

@login_required
@csrf_exempt
def migrate_layouts(request):
    if request.method == 'POST':
        try:
            layouts = json.loads(request.body).get('layouts', [])
            
            if not layouts:
                return JsonResponse({'success': False, 'error': 'No layouts provided'}, status=400)

            # Migrate layouts to the server
            for layout_data in layouts:
                if 'id' not in layout_data or 'name' not in layout_data or 'configuration' not in layout_data:
                    return JsonResponse({'success': False, 'error': 'Missing required fields in layout data'}, status=400)
                
                Layout.objects.update_or_create(
                    user=request.user,
                    id=layout_data['id'],
                    defaults={
                        'name': layout_data['name'],
                        'configuration': layout_data['configuration'],
                        'updated_at': layout_data['updated_at']
                    }
                )
            return JsonResponse({'success': True})

        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)
        except KeyError as e:
            return JsonResponse({'success': False, 'error': f'Missing key: {str(e)}'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)

    return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)


"""original"""
@csrf_exempt
#@staff_member_required  
def save_template(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            template_name = data.get('name')
            configuration = data.get('configuration')
            template, created = Template.objects.update_or_create(
                name=template_name,
                defaults={'configuration': configuration, 'status': 'active'},
            )
            return JsonResponse({'success': True, 'template_id': template.id})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'success': False, 'error': 'Invalid request method'})




@login_required
def load_layout(request, layout_id):
    try:
        layout = Layout.objects.get(user=request.user, name=layout_id)
        return JsonResponse({'success': True, 'configuration': layout.configuration})
    except Layout.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Layout not found'})

@login_required
def load_template(request, template_id):
    try:
        layout = Template.objects.get(name=template_id)
        return JsonResponse({'success': True, 'configuration': layout.configuration})
    except Layout.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Template not found'})

def load_item(request, item_id):
    try:
        layout = Layout.objects.filter(name=item_id).first()
        if layout:
            return JsonResponse({'configuration': layout.configuration})

        template = Template.objects.filter(name=item_id, status='active').first()
        if template:
            return JsonResponse({'configuration': template.configuration})

        return JsonResponse({'error': 'Item not found'}, status=404)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@login_required
def get_recent_layouts(request):
    layouts = Layout.objects.filter(user=request.user, status='saved').order_by('-created_at')[:4]
    layouts_data = [
        {
            'id': layout.id,
            'name': layout.name,
            'configuration': layout.configuration,
            'thumbnail_url': request.build_absolute_uri(layout.thumbnail.url) if layout.thumbnail else '/static/thumbnails/default.png'
        }
        for layout in layouts
    ]
    return JsonResponse({'success': True, 'layouts': layouts_data})



def get_recent_templates(request):
    try:
        templates = Template.objects.filter(status='active').order_by('-created_at')[:4]
        templates_data = [
            {
                'id': template.id,
                'name': template.name,
                'configuration': template.configuration,
                'thumbnail_url': request.build_absolute_uri(template.thumbnail.url) if template.thumbnail else '/static/thumbnails/default.png'
            }
            for template in templates
        ]
        return JsonResponse({'success': True, 'templates': templates_data})
    except Exception as e:
        print(f"Error fetching templates: {e}")
        return JsonResponse({'success': False, 'error': 'Internal server error'}, status=500)



def use_template(request, template_id):
    template = get_object_or_404(Template, id=template_id)
    return JsonResponse({
        'success': True,
        'configuration': template.configuration,
    })


def check_auth_status(request):
    is_authenticated = request.user.is_authenticated
    return JsonResponse({'authenticated': is_authenticated})




@login_required
def layouthub(request):
    
    live_layouts = Layout.objects.filter(user=request.user, status='live').order_by('-created_at')[:4]

    return render(request, 'layouthub.html', {
        'live_layouts': live_layouts,

    })   

@login_required
def get_live_layouts(request):
    live_layouts = Layout.objects.filter(user=request.user, status='live').order_by('-created_at')[:4]
    
    layouts_data = [
        {
            'id': layout.id,
            'name': layout.name,
            'configuration': layout.configuration,  
            'thumbnail_url': request.build_absolute_uri(layout.thumbnail.url) if layout.thumbnail else '/static/thumbnails/default.png'

        }
        for layout in live_layouts
    ]
    
    return JsonResponse({'success': True, 'layouts': layouts_data}) 


@login_required
def get_layout_details(request, layout_id):
    try:
        layout = Layout.objects.get(id=layout_id, user=request.user)
        return JsonResponse({
            "name": layout.name,
            "created_at": layout.created_at.strftime("%d %B %Y"),
            "html_content": layout.html_content  # Assuming you store HTML content
        })
    except Layout.DoesNotExist:
        return JsonResponse({"error": "Layout not found"}, status=404)
    


def publichub(request, username):
    user_obj = get_object_or_404(User, username__iexact=username)

    layouts = Layout.objects.filter(user=user_obj, status='live').order_by('-created_at')

    return render(request, 'publichub.html', {'layouts': layouts, 'profile_user': user_obj})



@login_required
def save_thumbnail(request):
    if request.method == 'POST':
        try:
            # Parse incoming JSON data
            data = json.loads(request.body)
            thumbnail_data = data.get('thumbnail')
            layout_id = data.get('layout_id')  # Ensure layout_id is sent from frontend

            if not thumbnail_data or not layout_id:
                return JsonResponse({'error': 'Missing thumbnail data or layout ID'}, status=400)

            # Decode the base64 image
            format, imgstr = thumbnail_data.split(';base64,')
            img_data = base64.b64decode(imgstr)
            
            # Open the image with PIL
            image = Image.open(BytesIO(img_data))

            # Resize the image to 200px width (maintaining aspect ratio)
            max_width = 200
            width_percent = (max_width / float(image.size[0]))
            new_height = int((float(image.size[1]) * float(width_percent)))
            image = image.resize((max_width, new_height), Image.ANTIALIAS)

            # Save the image in memory
            image_buffer = BytesIO()
            image.save(image_buffer, format='PNG')
            image_buffer.seek(0)

            # Generate a unique filename
            image_name = f'thumbnail_{get_random_string(10)}.png'

            # Save the image to Django's storage
            layout = Layout.objects.get(id=layout_id)
            layout.thumbnail.save(image_name, ContentFile(image_buffer.read()))
            layout.save()

            return JsonResponse({'success': True, 'image_url': layout.thumbnail.url})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=400)





def upload_image(request):
    if request.method == "POST" and request.FILES.get("image"):
        image_file = request.FILES["image"]  # Get uploaded file

        # ✅ Check if the file is received correctly
        temp_path = "/tmp/test_image.jpg"  
        with open(temp_path, "wb") as f:
            f.write(image_file.read())  # Write file to temporary location
        
        # ✅ Check if the file exists
        if os.path.exists(temp_path):
            print(f"File saved at {temp_path}, size: {os.path.getsize(temp_path)} bytes")

        # ✅ Verify file type (optional)
        from PIL import Image
        try:
            with Image.open(temp_path) as img:
                img.verify()  # Ensure it's a valid image
                print("Image format:", img.format)
        except Exception as e:
            return HttpResponse(f"Invalid image: {e}", status=400)

        # ✅ Save to database if everything is fine
        user = request.user  # Example: Attach image to logged-in user
        user.profile_picture.save(image_file.name, image_file)

        return HttpResponse("Image uploaded successfully!")

    return HttpResponse("No image uploaded", status=400)
