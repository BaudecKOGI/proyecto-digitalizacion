from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from usuarios.views import (
    UsuarioViewSet,
    EditorViewSet,
    login_view,
    logout_view,
    me_view,
    update_profile_view,
    change_password_view,
    forgot_password_view,
    reset_password_view
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'editores', EditorViewSet, basename='editor')

urlpatterns = [
    path('auth/login/', login_view, name='api-login'),
    path('auth/logout/', logout_view, name='api-logout'),
    path('auth/me/', me_view, name='api-me'),
    path('auth/profile/', update_profile_view, name='api-update-profile'),
    path('auth/change-password/', change_password_view, name='api-change-password'),
    path('auth/forgot-password/', forgot_password_view, name='api-forgot-password'),
    path('auth/reset-password/', reset_password_view, name='api-reset-password'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('', include(router.urls)),
]
