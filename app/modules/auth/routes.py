from flask import Blueprint, render_template

mod = Blueprint('auth', __name__)


@mod.route('/signin', methods=['GET'])
def signin_template():
    return render_template('signin.html')


@mod.route('/signup', methods=['GET'])
def signup_template():
    return render_template('signup.html')