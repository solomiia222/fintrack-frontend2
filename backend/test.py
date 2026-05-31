from db import Base, engine
import models

load_dotenv()

Base.metadata.create_all(bind=engine)