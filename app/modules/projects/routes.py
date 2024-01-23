from flask import Blueprint, render_template

mod = Blueprint('projects', __name__)

@mod.route('/grid', methods=['GET'])
def index_grid():
    return render_template('projects.html')


@mod.route('/creative', methods=['GET'])
def index_creative():
    return render_template('project-creative.html')


@mod.route('/carousel', methods=['GET'])
def index_carousel():
    return render_template('project-carousel.html')


@mod.route('/details', methods=['GET'])
def index_details():
    return render_template('project-details.html')