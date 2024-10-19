from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
import jwt
import datetime

app = Flask(__name__)

CORS(
    app,
    resources={r"/*": {"origins": ["http://localhost:3000", "http://localhost:3000/"]}},
    supports_credentials=True,
)


# MySQL database setup
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:@localhost/flask_app"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = "hLfO3PEm7iWbZx6iWvmsMTyx5Vn9XQS2"
db = SQLAlchemy(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)


# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)


# HOME ROUTE FOR TEST
@app.route("/")
def home():
    return "Welcome to the Flask App!"


@app.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")

        if User.query.filter_by(email=email).first():
            return jsonify({"message": "Email already exists"}), 400

        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
        new_user = User(email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "Signup successful!"})
    except Exception as e:
        print(e)  # Log the error
        return jsonify({"message": "An error occurred"}), 500


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password, password):
        print(f"User found: {user.email}, Password match: True")
        # Create JWT token
        try:
            token = jwt.encode(
                {
                    "user_id": user.id,
                    "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
                },
                app.secret_key,
                algorithm="HS256",
            )
            print(f"Generated token: {token}")
        except Exception as e:
            print(f"Error generating token: {e}")
            return jsonify({"message": "Token generation error"}), 500

        # Set cookie
        response = make_response(jsonify({"message": "Login successful!"}))
        response.set_cookie("jwt", token, httponly=True, secure=False)
        return response
    else:
        return jsonify({"message": "Invalid email or password"}), 401



@app.route("/protected", methods=["GET"])
def protected():
    token = request.cookies.get("jwt")  # Get the cookie

    if not token:
        return jsonify({"message": "Token is missing!"}), 403

    try:
        data = jwt.decode(token, app.secret_key, algorithms=["HS256"])
        current_user = User.query.get(data["user_id"])
    except Exception:
        return jsonify({"message": "Token is invalid!"}), 403

    return jsonify({"message": f"Welcome, user {current_user.email}!"})


@app.route("/logout", methods=["POST"])
def logout():
    response = make_response(jsonify({"message": "Logout successful!"}))
    response.set_cookie("jwt", "", expires=0)  # Clear the cookie
    return response


if __name__ == "__main__":
    app.run(debug=True)
