from flask import Blueprint, request, jsonify
from backend.models import Company
from backend.extensions import db

user_bp=Blueprint('user',__name__,url_prefix='/api/user')