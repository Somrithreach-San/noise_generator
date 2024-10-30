from flask import Flask, render_template, jsonify, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from database import Base
from model import Sound
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
import os
from pathlib import Path

app = Flask(__name__)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:12959240@localhost:5432/python_sound_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Initialize database
engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)

def init_db():
    Base.metadata.create_all(engine)
    session = DBSession()
    
    # Check if we need to add initial sounds
    if session.query(Sound).count() == 0:
        initial_sounds = [
            Sound(
                name='rain',
                display_name='Rain',
                icon='🌧️',
                file_path='rain.mp3',
                default_volume=0.5,
                category='nature'
            ),
            Sound(
                name='forest',
                display_name='Forest',
                icon='🌲',
                file_path='forest.mp3',
                default_volume=0.5,
                category='nature'
            ),
            Sound(
                name='waves',
                display_name='Waves',
                icon='🌊',
                file_path='waves.mp3',
                default_volume=0.5,
                category='nature'
            ),
            Sound(
                name='fire',
                display_name='Fire',
                icon='🔥',
                file_path='fire.mp3',
                default_volume=0.5,
                category='nature'
            )
        ]
        
        for sound in initial_sounds:
            session.add(sound)
        
        session.commit()
    
    session.close()

@app.route('/')
def index():
    session = DBSession()
    sounds = session.query(Sound).all()
    session.close()
    return render_template('index.html', sounds=sounds)

@app.route('/api/sounds')
def get_sounds():
    session = DBSession()
    sounds = session.query(Sound).all()
    sound_list = [sound.to_dict() for sound in sounds]
    session.close()
    return jsonify(sound_list)

@app.route('/api/sound/<sound_name>')
def get_sound(sound_name):
    session = DBSession()
    sound = session.query(Sound).filter_by(name=sound_name).first()
    session.close()
    
    if not sound:
        return jsonify({'error': 'Sound not found'}), 404
    
    return jsonify(sound.to_dict())

@app.route('/sounds/<path:filename>')
def serve_sound(filename):
    try:
        return send_file(
            f'static/sounds/{filename}',
            mimetype='audio/mpeg'
        )
    except FileNotFoundError:
        return jsonify({'error': 'Sound file not found'}), 404

if __name__ == '__main__':
    # Create necessary directories
    Path('static/sounds').mkdir(parents=True, exist_ok=True)
    
    # Initialize database and add initial sounds
    init_db()
    
    app.run(debug=True)