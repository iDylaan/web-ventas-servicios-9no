from flask import Blueprint, render_template

mod = Blueprint('pages', __name__)

@mod.route('/about-us', methods=['GET'])
def about_us():
    return render_template('about.html')


@mod.route('/pricing', methods=['GET'])
def pricing():
    return render_template('pricing.html')