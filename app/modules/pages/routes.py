from flask import Blueprint, render_template

mod = Blueprint('pages', __name__)

@mod.route('/about-us', methods=['GET'])
def about_us():
    return render_template('about.html')


@mod.route('/pricing', methods=['GET'])
def pricing():
    return render_template('pricing.html')


@mod.route('/team_profile', methods=['GET'])
def team_profile_template():
    return render_template('team-profile.html')


@mod.route('/team', methods=['GET'])
def team_template():
    return render_template('team.html')


@mod.route('/faqs', methods=['GET'])
def faqs_template():
    return render_template('faqs.html')

@mod.route('/contacto', methods=['GET'])
def contacto_template():
    return render_template('contact.html')

@mod.route('/terminos_condiciones', methods=['GET'])
def terminos_condiciones_template():
    return render_template('terminos-condiciones.html')