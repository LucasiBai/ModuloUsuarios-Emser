from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode


def send_reset_password_email(email):
    """
    Sends an email with the reset password url
    """
    reset_url = get_reset_password_url(email)

    print(reset_url)


def get_reset_password_url(email):
    """
    Generates the reset password url
    """

    user = get_user_model().objects.get(email=email)

    encode = urlsafe_base64_encode(force_bytes(user.pk))
    token = PasswordResetTokenGenerator().make_token(user)

    reset_url = (
        f"https://emser-modulo-usuarios.netlify.app/reset_password/{encode}/{token}"
    )

    return reset_url
