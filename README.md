Event Registration Web Application
-

This is application that allows clients to register for events.
I've used the Django framework for backend and Next.js for frontend.
Backend is fully setup with user authentication and secured endpoints,
however you might miss cancel registration feature on the frontend.

To run the project let's clone it first:

```bash
git clone --depth=1 https://github.com/nebulaw/events-manager
cd events-manager/
```

Secondly, we need to install pip and node.js packages:

```bash
# set up virtual env and pip packages
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# set up node
cd website
npm i
```

Third step is to create `.env` file, `.env.sample` is provided to identify what is required.
Note that cloudinary is used to save thumbnails.

After setting up the environment, simply run:

```bash
# one shell
python manage.py makemigrations
python manage.py migrate
python manage.py runserver

# another shell
cd website
npm run dev
```


