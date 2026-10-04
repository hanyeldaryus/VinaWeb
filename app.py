from flask import Flask, render_template
from data import profile, experience, education, organisation, skills, achievement

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html',
                           profile=profile,
                           experience=experience,
                           education=education,
                           organisation=organisation,
                           skills=skills,
                           achievement=achievement)

if __name__ == '__main__':
    app.run(debug=True)